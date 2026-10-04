from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.schemas.auth import UserRegister, UserLogin, UserProfileResponse, TokenResponse
from app.services.auth_service import auth_service
from app.models.user import User

router = APIRouter()

@router.post("/auth/register", response_model=TokenResponse)
async def register(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")
    
    user = auth_service.create_user(db, payload)
    token = auth_service.generate_token(user)
    return TokenResponse(access_token=token, user=UserProfileResponse.model_validate(user))

@router.post("/auth/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, payload)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = auth_service.generate_token(user)
    return TokenResponse(access_token=token, user=UserProfileResponse.model_validate(user))

@router.get("/auth/me", response_model=UserProfileResponse)
async def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        # Fallback to demo user if unauthenticated
        user = db.query(User).first()
        if not user:
            user = auth_service.create_user(db, UserRegister(email="admin@optiroute.ai", password="adminpassword", full_name="Admin User"))
        return user
    
    token = authorization.split(" ")[1]
    try:
        parts = token.split("_")
        user_id = int(parts[1])
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            return user
    except Exception:
        pass

    raise HTTPException(status_code=401, detail="Invalid authorization token.")
