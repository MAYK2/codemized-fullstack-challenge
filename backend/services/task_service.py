from sqlalchemy.orm import Session
from fastapi import HTTPException
from repositories.task_repository import TaskRepository
from repositories.project_repository import ProjectRepository
import schemas

class TaskService:
    def __init__(self):
        self.task_repo = TaskRepository()
        self.project_repo = ProjectRepository()

    def create_task(self, db: Session, task: schemas.TaskCreate, creator_id: int):
        project = self.project_repo.get_project_by_id(db, task.project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        
        if project.creator_id != creator_id:
            raise HTTPException(status_code=403, detail="No podés crear tareas en un proyecto que no te pertenece")

        # Si no se especifica un asignado, se asigna automáticamente al creador
        assignee_id = task.assignee_id if task.assignee_id is not None else creator_id

        return self.task_repo.create_task(db, title=task.title, description=task.description, project_id=task.project_id, assignee_id=assignee_id, status=task.status)

    def get_tasks_by_project(self, db: Session, project_id: int):
        return self.task_repo.get_tasks_by_project(db, project_id)
