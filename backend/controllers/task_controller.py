from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas
from database import get_db
from auth import get_current_user_id
from services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])
task_service = TaskService()

@router.post("/", response_model=schemas.TaskResponse)
def create_task(
    task: schemas.TaskCreate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return task_service.create_task(db, task, current_user_id)

@router.get("/project/{project_id}", response_model=List[schemas.TaskResponse])
def get_project_tasks(
    project_id: int, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return task_service.get_tasks_by_project(db, project_id)