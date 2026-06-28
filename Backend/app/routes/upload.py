from fastapi import APIRouter, UploadFile, File
from app.services.pdf_service import extract_pages
from app.services.chunk_service import split_pages
from app.services.embedding_service import create_embeddings
from app.services.vector_service import create_faiss_index
from app.utils.storage import save_chunks
from sqlalchemy.orm import Session
from fastapi import Depends

from app.models.database import get_db
from app.models.document import Document
from app.routes.auth import get_current_user
import os
router = APIRouter()

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as pdf:
        pdf.write(await file.read())

    pages = extract_pages(file_path)

    chunks = split_pages(pages)
    save_chunks(chunks)

    embeddings = create_embeddings(
        [chunk["text"] for chunk in chunks]
    )

    index = create_faiss_index(embeddings)

    # Save document to PostgreSQL
    document = Document(
        filename=file.filename,
        file_path=file_path,
        user_id=user.id
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return {
        "filename": file.filename,
        "characters": sum(len(page["text"]) for page in pages),
        "total_chunks": len(chunks),
        "embedding_dimension": len(embeddings[0]),
        "vectors_stored": index.ntotal
    }

@router.get("/documents")
def get_documents(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    documents = (
        db.query(Document)
        .filter(Document.user_id == user.id)
        .order_by(Document.created_at.desc())
        .all()
    )

    return documents