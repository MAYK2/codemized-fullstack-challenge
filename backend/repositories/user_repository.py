from sqlalchemy.orm import Session
import models

class UserRepository:
    def get_user_by_id(self, db: Session, user_id: int):
        return db.query(models.User).filter(models.User.id == user_id).first()

    def get_user_by_email(self, db: Session, email: str):
        return db.query(models.User).filter(models.User.email == email).first()

    def create_user(self, db: Session, email: str, alias: str, hashed_password: str):
        db_user = models.User(email=email, alias=alias, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def get_all_users(self, db: Session):
        return db.query(models.User).all()
