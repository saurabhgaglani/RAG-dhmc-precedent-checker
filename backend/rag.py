import os
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_community.embeddings import HuggingFaceEmbeddings

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise RuntimeError("Missing MONGODB_URI environment variable")

dbName = "book_mongodb_chunks"
collectionName = "chunked_data"
index = "vector_index"

vectorStore = MongoDBAtlasVectorSearch.from_connection_string(
    MONGODB_URI,
    f"{dbName}.{collectionName}",
    HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    ),
    index_name=index,
)

def query_data(query, k=3):
    retriever = vectorStore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k},
    )
    results = retriever.invoke(query)
    return results

# FastAPI
app = FastAPI()

class SearchRequest(BaseModel):
    query: str
    k: Optional[int] = 3

@app.post("/search")
async def search(request: SearchRequest):
    results = query_data(request.query, request.k)
    return {
        "results": [
            {
                "content": doc.page_content,
                "metadata": doc.metadata
            }
            for doc in results
        ]
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
