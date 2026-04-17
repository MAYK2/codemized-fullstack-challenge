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

@router.patch("/{task_id}/assign", response_model=schemas.TaskResponse)
def assign_task(
    task_id: int,
    body: schemas.TaskAssign,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Asigna (o re-asigna) una tarea a un usuario específico."""
    return task_service.assign_task(db, task_id, body.assignee_id, current_user_id)