# denial_analyzer.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import httpx
import google.generativeai as genai
from PyPDF2 import PdfReader
from docx import Document
import io
import os

app = FastAPI(title="Insurance Denial Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Config
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

VECTOR_SEARCH_API = os.getenv("VECTOR_SEARCH_API", "http://localhost:8000")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY environment variable")

# Initialize with Gemma 3 27B via Google AI Studio
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemma-3-27b-it')

# Models
class DenialAnalysis(BaseModel):
    extracted_text: str
    keywords: List[str]
    denial_reasons: List[str]
    similar_cases: List[dict]
    validity_score: float
    legal_basis: str

# Text extraction
async def extract_text_from_pdf(file_bytes):
    pdf = PdfReader(io.BytesIO(file_bytes))
    return "".join([page.extract_text() for page in pdf.pages])

async def extract_text_from_docx(file_bytes):
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs])

async def extract_text(file: UploadFile, content: bytes) -> str:
    filename = file.filename.lower()
    if filename.endswith('.pdf'):
        return await extract_text_from_pdf(content)
    elif filename.endswith('.docx'):
        return await extract_text_from_docx(content)
    elif filename.endswith('.txt'):
        return content.decode('utf-8')
    raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOCX, or TXT")

# Keyword & reason extraction with LLM
def extract_keywords_and_reasons(text: str):
    # Quick validation
    text_lower = text.lower()
    insurance_keywords = ["insurance", "claim", "denial", "denied", "coverage", "policy", "medical", "health"]
    has_insurance_context = any(kw in text_lower for kw in insurance_keywords)
    
    if not has_insurance_context:
        raise HTTPException(status_code=400, detail="This doesn't appear to be an insurance denial document. Please upload a valid denial letter.")
    
    prompt = f"""Analyze this insurance denial letter and extract key information for database search.

Denial Letter:
{text[:3000]}

Extract and return in this EXACT format:

DENIAL_REASONS: [list specific denial reasons or codes mentioned, e.g., "not medically necessary", "experimental", "out of network"]

SEARCH_SENTENCES: [extract 2-3 complete sentences verbatim from the letter that describe the core denial reason - these will be used for semantic search]

KEYWORDS: [list 8-10 rich keywords and medical/insurance terms that would help find similar cases, e.g., "Stage IV cancer", "biomarker testing", "prior authorization", "experimental procedure"]

Be precise and extract actual text from the letter."""

    try:
        response = model.generate_content(prompt)
        result = response.text
        
        # Parse response
        denial_reasons = []
        search_sentences = []
        keywords = []
        
        for line in result.split('\n'):
            line = line.strip()
            if line.startswith('DENIAL_REASONS:'):
                reasons_text = line.split(':', 1)[1].strip()
                denial_reasons = [r.strip(' "[]') for r in reasons_text.split(',') if r.strip()]
            elif line.startswith('SEARCH_SENTENCES:'):
                sentences_text = line.split(':', 1)[1].strip()
                search_sentences = [s.strip(' "[]') for s in sentences_text.split('.') if len(s.strip()) > 20]
            elif line.startswith('KEYWORDS:'):
                keywords_text = line.split(':', 1)[1].strip()
                keywords = [k.strip(' "[]') for k in keywords_text.split(',') if k.strip()]
        
        # Fallback if parsing fails
        if not keywords:
            keywords = ["insurance denial", "claim review"]
        if not denial_reasons:
            denial_reasons = ["unspecified"]
        if not search_sentences:
            search_sentences = [text[:200]]
        
        return keywords, denial_reasons, search_sentences
        
    except Exception as e:
        print(f"LLM extraction error: {e}")
        # Fallback to basic extraction
        return ["insurance denial"], ["unspecified"], [text[:200]]

# Vector search
async def search_similar_cases(query: str, k: int = 3):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{VECTOR_SEARCH_API}/search",
                json={"query": query, "k": k},
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()["results"]
        except Exception as e:
            print(f"Vector search error: {e}")
            return []

# Model analysis with Gemma 3 27B
def analyze_with_model(text: str, similar_cases: List[dict], denial_reasons: List[str]):
    # Check if we have similar cases
    if not similar_cases or len(similar_cases) == 0:
        return 50.0, "No similar cases found in our database. Unable to provide legal analysis without precedent data."
    
    context = "\n\n".join([case["content"] for case in similar_cases])
    print(context)
    prompt = f"""You are an insurance claim analyst. Analyze this denial letter ONLY using the provided legal cases/precedents.

Denial Letter:
{text[:2000]}

Identified Denial Reasons:
{', '.join(denial_reasons) if denial_reasons else 'Not clearly identified'}

Similar Legal Cases/Precedents from Database:
{context}

IMPORTANT: Base your analysis ONLY on the provided precedents above. If the precedents don't contain relevant information, state that clearly.

Provide:
1. Validity Score (0-100): How valid/justified is this denial based on the provided legal precedents? 
   - LOW score (0-40) = Denial appears INVALID/UNJUSTIFIED (good for patient, bad for insurer)
   - MEDIUM score (40-70) = Questionable validity
   - HIGH score (70-100) = Denial appears VALID/JUSTIFIED (bad for patient, good for insurer)
2. Legal Basis: Brief explanation referencing the specific precedents provided above

Format your response as:
VALIDITY_SCORE: [number]
LEGAL_BASIS: [explanation based on provided precedents]
"""

    try:
        response = model.generate_content(prompt)
        model_response = response.text
        
        # Parse response
        validity_score = 50.0  # default
        legal_basis = model_response
        
        for line in model_response.split('\n'):
            if 'VALIDITY_SCORE:' in line:
                try:
                    validity_score = float(line.split(':')[1].strip())
                except:
                    pass
            if 'LEGAL_BASIS:' in line:
                legal_basis = line.split(':', 1)[1].strip()
        
        return validity_score, legal_basis
        
    except Exception as e:
        print(f"Gemma API error: {e}")
        return 50.0, "Unable to analyze - API error occurred"

# Main endpoint
@app.post("/upload", response_model=DenialAnalysis)
async def upload_denial(file: UploadFile = File(...)):
    """Upload insurance denial document and get analysis"""
    try:
        content = await file.read()
        text = await extract_text(file, content)
        
        if len(text.strip()) < 50:
            raise HTTPException(status_code=400, detail="Document too short or empty")
        
        # Extract keywords and reasons
        keywords, denial_reasons, search_sentences = extract_keywords_and_reasons(text)
        
        # Search similar cases using extracted sentences
        search_query = " ".join(search_sentences[:2])
        similar_cases = await search_similar_cases(search_query, k=3)
        
        # Analyze with model
        validity_score, legal_basis = analyze_with_model(text, similar_cases, denial_reasons)
        
        return DenialAnalysis(
            extracted_text=text,
            keywords=keywords,
            denial_reasons=denial_reasons,
            similar_cases=similar_cases,
            validity_score=validity_score,
            legal_basis=legal_basis
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Run: uvicorn denial_analyzer:app --reload --port 8001