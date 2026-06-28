from fastapi import APIRouter
from pydantic import BaseModel
import faiss

from app.utils.storage import load_chunks
from app.services.embedding_service import create_query_embedding
from app.services.retrieval_service import search_similar_chunks
from app.services.llm_service import generate_answer

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
def ask_question(data: QuestionRequest):

    index = faiss.read_index("vectorstore/faiss_index.bin")

    chunks = load_chunks()

    query_embedding = create_query_embedding(data.question)

    results = search_similar_chunks(
        query_embedding,
        index,
        chunks,
        k=5
    )
    
    context = "\n\n".join(
    chunk["text"]
    for chunk in results
    )

    answer = generate_answer(
        data.question,
        context
    )

    return {
    "question": data.question,
    "answer": answer,
    "sources": results
  }