import os
from pymongo import MongoClient
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from keybert import KeyBERT

# optional .env loader
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise RuntimeError("Missing MONGODB_URI environment variable")

# MongoDB
client = MongoClient(MONGODB_URI)
dbName = "book_mongodb_chunks"
collectionName = "chunked_data"
collection = client[dbName][collectionName]

# Load PDF
loader = PyPDFLoader("../sample_files/nine.pdf")
pages = loader.load()
cleaned_pages = [p for p in pages if len(p.page_content.split()) > 20]

# Split
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=150)
split_docs = text_splitter.split_documents(cleaned_pages)

# KeyBERT (local, free)
kw_model = KeyBERT(model="sentence-transformers/all-MiniLM-L6-v2")

for d in split_docs:
    keywords = kw_model.extract_keywords(d.page_content, top_n=8)
    d.metadata["title"] = d.metadata.get("source", "document")
    d.metadata["keywords"] = [k for k, _ in keywords]
    d.metadata["hasCode"] = "```" in d.page_content

# Free embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Store in MongoDB Atlas Vector Search
vectorStore = MongoDBAtlasVectorSearch.from_documents(
    split_docs, embeddings, collection=collection
)
