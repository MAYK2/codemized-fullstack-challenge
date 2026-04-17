from sqlalchemy.orm import Session
from fastapi import HTTPException
from repositories.user_repository import UserRepository
import schemas
import auth

class UserService:
    def __init__(self):
        self.user_repo = UserRepository()

    def create_user(self, db: Session, user: schemas.UserCreate):
        if self.user_repo.get_user_by_email(db, user.email):
            raise HTTPException(status_code=400, detail="El email ya está registrado")
        
        hashed_password = auth.get_password_hash(user.password)
        return self.user_repo.create_user(db, email=user.email, alias=user.alias, hashed_password=hashed_password)

    def get_user_me(self, db: Session, user_id: int):
        user = self.user_repo.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return user

    def get_all_users(self, db: Session):
        return self.user_repo.get_all_users(db)
