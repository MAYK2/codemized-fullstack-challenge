from sqlalchemy.orm import Session
from repositories.project_repository import ProjectRepository
import schemas

class ProjectService:
    def __init__(self):
        self.project_repo = ProjectRepository()

    def create_project(self, db: Session, project: schemas.ProjectCreate, creator_id: int):
        return self.project_repo.create_project(db, title=project.title, description=project.description, creator_id=creator_id)

    def get_projects(self, db: Session, skip: int = 0, limit: int = 100):
        return self.project_repo.get_projects(db, skip=skip, limit=limit)
        
    def get_projects_by_user(self, db: Session, user_id: int):
        return self.project_repo.get_projects_by_user(db, user_id=user_id)
