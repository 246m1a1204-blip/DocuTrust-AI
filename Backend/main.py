from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.models.database import Base, engine

from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router
from app.routes.auth import router as auth_router

from app.routes.auth import get_current_user

# Import models so tables are created
from app.models.document import Document
from app.models.user import User

app = FastAPI(
    title="DocuTrust API",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(auth_router)

@app.get("/")
def home():
    return {"message": "DocuTrust Running"}

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.models.database import Base, engine

from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router
from app.routes.auth import router as auth_router

from app.routes.auth import get_current_user

# Import models so tables are created
from app.models.document import Document
from app.models.user import User

app = FastAPI(
    title="DocuTrust API",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(auth_router)

@app.get("/")
def home():
    return {"message": "DocuTrust Running"}

@app.get("/profile")
def profile(user=Depends(get_current_user)):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }