import hashlib
import secrets
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin

class AuthService:
    def hash_password(self, password: str) -> str:
        # Standard PBKDF2 SHA256 password hash
        salt = "optiroute_salt_2026"
        return hashlib.pbkdf2_hmac(
            'sha256', 
            password.encode('utf-8'), 
            salt.encode('utf-8'), 
            100000
        ).hex()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.hash_password(plain_password) == hashed_password

    def create_user(self, db: Session, user_in: UserRegister) -> User:
        hashed_pw = self.hash_password(user_in.password)
        api_key = f"op_key_{secrets.token_hex(16)}"
        user = User(
            email=user_in.email.lower().strip(),
            hashed_password=hashed_pw,
            full_name=user_in.full_name,
            role="user",
            plan_tier="free",
            api_key=api_key
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def authenticate_user(self, db: Session, login_in: UserLogin) -> Optional[User]:
        user = db.query(User).filter(User.email == login_in.email.lower().strip()).first()
        if not user:
            return None
        if not self.verify_password(login_in.password, user.hashed_password):
            return None
        return user

    def generate_token(self, user: User) -> str:
        # Simplified token format for demonstration
        return f"token_{user.id}_{secrets.token_hex(16)}"

auth_service = AuthService()
