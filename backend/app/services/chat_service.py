import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.chat_session import ChatSession, ChatMessage

class ChatService:
    def create_session(self, db: Session, user_id: Optional[int] = None, title: str = "New Conversation") -> ChatSession:
        session_id = f"chat-{uuid.uuid4().hex[:12]}"
        session = ChatSession(
            session_id=session_id,
            user_id=user_id,
            title=title
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    def get_user_sessions(self, db: Session, user_id: Optional[int] = None, limit: int = 50) -> List[ChatSession]:
        query = db.query(ChatSession)
        if user_id:
            query = query.filter(ChatSession.user_id == user_id)
        return query.order_by(ChatSession.updated_at.desc()).limit(limit).all()

    def get_session(self, db: Session, session_id: str) -> Optional[ChatSession]:
        return db.query(ChatSession).filter(ChatSession.session_id == session_id).first()

    def add_message(
        self,
        db: Session,
        session_id: str,
        role: str,
        content: str,
        model: Optional[str] = None,
        complexity: Optional[str] = None,
        cost_usd: float = 0.0,
        cost_inr: float = 0.0,
        quality_score: Optional[float] = None,
        cache_hit: bool = False,
        latency_ms: float = 0.0
    ) -> ChatMessage:
        session = self.get_session(db, session_id)
        if not session:
            session = self.create_session(db, title=content[:30] + "...")
        
        # Auto-update session title if it's default
        if session.title == "New Conversation" and role == "user":
            session.title = content[:35] + ("..." if len(content) > 35 else "")
            
        msg = ChatMessage(
            session_id=session.session_id,
            role=role,
            content=content,
            model=model,
            complexity=complexity,
            cost_usd=cost_usd,
            cost_inr=cost_inr,
            quality_score=quality_score,
            cache_hit=cache_hit,
            latency_ms=latency_ms
        )
        db.add(msg)
        db.commit()
        db.refresh(msg)
        return msg

    def delete_session(self, db: Session, session_id: str) -> bool:
        session = self.get_session(db, session_id)
        if session:
            db.delete(session)
            db.commit()
            return True
        return False

chat_service = ChatService()
