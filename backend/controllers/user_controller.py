from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from auth import get_current_user_id
import schemas
from database import get_db
from services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])
user_service = UserService()

@router.get("/me", response_model=schemas.UserResponse)
def read_user_me(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return user_service.get_user_me(db, user_id=current_user_id)

@router.get("/", response_model=List[schemas.UserPublic])
def list_users(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Lista todos los usuarios disponibles para asignación de tareas."""
    return user_service.get_all_users(db)

@router.post("/", response_model=schemas.UserResponse)
def create_new_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user(db, user)