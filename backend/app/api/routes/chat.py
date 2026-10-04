from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.chat import ChatSessionCreate, ChatSessionResponse, ChatMessageResponse
from app.services.chat_service import chat_service

router = APIRouter()

@router.post("/chat/sessions", response_model=ChatSessionResponse)
async def create_chat_session(payload: ChatSessionCreate, db: Session = Depends(get_db)):
    session = chat_service.create_session(db, title=payload.title or "New Conversation")
    return session

@router.get("/chat/sessions", response_model=List[ChatSessionResponse])
async def list_chat_sessions(db: Session = Depends(get_db)):
    sessions = chat_service.get_user_sessions(db)
    return sessions

@router.get("/chat/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_chat_session(session_id: str, db: Session = Depends(get_db)):
    session = chat_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")
    return session

@router.delete("/chat/sessions/{session_id}")
async def delete_chat_session(session_id: str, db: Session = Depends(get_db)):
    success = chat_service.delete_session(db, session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Chat session not found.")
    return {"status": "success", "message": "Conversation session deleted."}
