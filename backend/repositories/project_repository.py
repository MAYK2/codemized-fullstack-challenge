from sqlalchemy.orm import Session
import models
import schemas

class ProjectRepository:
    def create_project(self, db: Session, title: str, description: str, creator_id: int):
        db_project = models.Project(
            title=title,
            description=description,
            creator_id=creator_id
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project

    def get_projects(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(models.Project).offset(skip).limit(limit).all()

    def get_project_by_id(self, db: Session, project_id: int):
        return db.query(models.Project).filter(models.Project.id == project_id).first()
        
    def get_projects_by_user(self, db: Session, user_id: int, skip: int = 0, limit: int = 100):
        return db.query(models.Project).filter(models.Project.creator_id == user_id).offset(skip).limit(limit).all()

    def delete_project(self, db: Session, project_id: int):
        project = self.get_project_by_id(db, project_id)
        if project:
            db.delete(project)
            db.commit()
        return project
