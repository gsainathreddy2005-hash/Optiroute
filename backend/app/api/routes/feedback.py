from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.services.feedback_service import feedback_service
from app.models.request_log import RequestLog

router = APIRouter()

@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    req_log = db.query(RequestLog).filter(RequestLog.request_id == payload.request_id).first()
    model = req_log.selected_model if req_log else None
    complexity = req_log.complexity if req_log else None
    quality_score = int(req_log.quality_score) if req_log else None

    fb = feedback_service.create_feedback(
        db, 
        feedback_in=payload,
        model=model,
        complexity=complexity,
        quality_score=quality_score
    )
    return fb

@router.get("/feedback")
async def list_feedback(limit: int = 50, db: Session = Depends(get_db)):
    return feedback_service.get_all_feedback(db, limit=limit)
