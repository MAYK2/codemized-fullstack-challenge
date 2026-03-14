from sqlalchemy.orm import Session
from repositories.task_repository import TaskRepository
import schemas

class TaskService:
    def __init__(self):
        self.task_repo = TaskRepository()

    def create_task(self, db: Session, task: schemas.TaskCreate, creator_id: int):
        assignee = task.assignee_id if task.assignee_id else creator_id
        return self.task_repo.create_task(db, title=task.title, description=task.description, project_id=task.project_id, assignee_id=assignee)

    def get_tasks_by_project(self, db: Session, project_id: int):
        return self.task_repo.get_tasks_by_project(db, project_id)
