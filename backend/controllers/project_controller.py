from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from auth import get_current_user_id
import schemas
from database import get_db
from services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["Projects"])
project_service = ProjectService()

@router.post("/", response_model=schemas.ProjectResponse)
def create_new_project(
    project: schemas.ProjectCreate, 
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return project_service.create_project(db, project, current_user_id)

@router.get("/", response_model=List[schemas.ProjectResponse])
def read_all_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return project_service.get_projects(db, skip=skip, limit=limit)

@router.get("/my-projects", response_model=List[schemas.ProjectResponse])
def read_my_projects(db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    return project_service.get_projects_by_user(db, current_user_id)
