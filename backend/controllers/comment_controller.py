from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas
from database import get_db
from auth import get_current_user_id
from services.comment_service import CommentService

router = APIRouter(prefix="/comments", tags=["Comments"])
comment_service = CommentService()

@router.post("/", response_model=schemas.CommentResponse)
def create_comment(
    comment: schemas.CommentCreate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return comment_service.create_comment(db, comment, current_user_id)

@router.get("/task/{task_id}", response_model=List[schemas.CommentResponse])
def get_task_comments(
    task_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return comment_service.get_comments_by_task(db, task_id)
