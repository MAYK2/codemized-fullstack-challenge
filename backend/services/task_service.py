from sqlalchemy.orm import Session
from fastapi import HTTPException
from repositories.task_repository import TaskRepository
from repositories.project_repository import ProjectRepository
from repositories.user_repository import UserRepository
import schemas

class TaskService:
    def __init__(self):
        self.task_repo = TaskRepository()
        self.project_repo = ProjectRepository()
        self.user_repo = UserRepository()

    def create_task(self, db: Session, task: schemas.TaskCreate, creator_id: int):
        project = self.project_repo.get_project_by_id(db, task.project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        
        if project.creator_id != creator_id:
            raise HTTPException(status_code=403, detail="No podés crear tareas en un proyecto que no te pertenece")

        # Si no se especifica un asignado, se asigna automáticamente al creador
        assignee_id = task.assignee_id if task.assignee_id is not None else creator_id

        return self.task_repo.create_task(db, title=task.title, description=task.description, project_id=task.project_id, assignee_id=assignee_id, status=task.status)

    def assign_task(self, db: Session, task_id: int, assignee_id: int, current_user_id: int):
        task = self.task_repo.get_task_by_id(db, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")

        # Solo el dueño del proyecto puede re-asignar
        project = self.project_repo.get_project_by_id(db, task.project_id)
        if not project or project.creator_id != current_user_id:
            raise HTTPException(status_code=403, detail="No tenés permiso para reasignar esta tarea")

        # Validar que el usuario al que se asigna existe
        assignee = self.user_repo.get_user_by_id(db, assignee_id)
        if not assignee:
            raise HTTPException(status_code=404, detail=f"El usuario con ID {assignee_id} no existe")

        return self.task_repo.assign_task(db, task_id, assignee_id)

    def delete_task(self, db: Session, task_id: int, current_user_id: int):
        task = self.task_repo.get_task_by_id(db, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Tarea no encontrada")

        project = self.project_repo.get_project_by_id(db, task.project_id)
        if not project or project.creator_id != current_user_id:
            raise HTTPException(status_code=403, detail="Solo el creador del proyecto puede eliminar tareas")

        return self.task_repo.delete_task(db, task_id)

    def get_tasks_by_project(self, db: Session, project_id: int):
        return self.task_repo.get_tasks_by_project(db, project_id)
