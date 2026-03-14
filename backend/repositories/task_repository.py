from sqlalchemy.orm import Session
import models
import schemas

class TaskRepository:
    def create_task(self, db: Session, title: str, description: str, project_id: int, assignee_id: int = None):
        db_task = models.Task(
            title=title,
            description=description,
            project_id=project_id,
            assignee_id=assignee_id
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task

    def get_tasks_by_project(self, db: Session, project_id: int):
        return db.query(models.Task).filter(models.Task.project_id == project_id).all()
