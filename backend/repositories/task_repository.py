from sqlalchemy.orm import Session
import models

class TaskRepository:
    def create_task(self, db: Session, title: str, description: str, project_id: int, assignee_id: int = None, status: str = "pending"):
        db_task = models.Task(
            title=title,
            description=description,
            project_id=project_id,
            assignee_id=assignee_id,
            status=status
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task

    def get_tasks_by_project(self, db: Session, project_id: int):
        return db.query(models.Task).filter(models.Task.project_id == project_id).all()

    def get_task_by_id(self, db: Session, task_id: int):
        return db.query(models.Task).filter(models.Task.id == task_id).first()

    def assign_task(self, db: Session, task_id: int, assignee_id: int):
        task = self.get_task_by_id(db, task_id)
        if not task:
            return None
        task.assignee_id = assignee_id
        db.commit()
        db.refresh(task)
        return task

    def delete_task(self, db: Session, task_id: int):
        task = self.get_task_by_id(db, task_id)
        if task:
            db.delete(task)
            db.commit()
        return task
