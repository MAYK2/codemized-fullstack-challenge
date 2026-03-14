from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repositories.user_repository import UserRepository
import auth

class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()

    def login(self, db: Session, email: str, password: str):
        user = self.user_repo.get_user_by_email(db, email)
        if not user or not auth.verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token = auth.create_access_token(data={"sub": str(user.id)})
        return {"access_token": access_token, "token_type": "bearer"}
