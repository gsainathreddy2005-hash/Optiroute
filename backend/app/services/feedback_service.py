from sqlalchemy.orm import Session
from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate

class FeedbackService:
    def create_feedback(self, db: Session, feedback_in: FeedbackCreate, model: str = None, complexity: str = None, quality_score: int = None) -> Feedback:
        feedback = Feedback(
            request_id=feedback_in.request_id,
            rating=feedback_in.rating,
            comment=feedback_in.comment,
            model=model,
            complexity=complexity,
            quality_score=quality_score
        )
        db.add(feedback)
        db.commit()
        db.refresh(feedback)
        return feedback

    def get_all_feedback(self, db: Session, limit: int = 50):
        return db.query(Feedback).order_by(Feedback.created_at.desc()).limit(limit).all()

feedback_service = FeedbackService()
