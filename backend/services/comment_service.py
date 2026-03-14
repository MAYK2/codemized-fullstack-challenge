from sqlalchemy.orm import Session
from repositories.comment_repository import CommentRepository
import schemas

class CommentService:
    def __init__(self):
        self.comment_repo = CommentRepository()

    def create_comment(self, db: Session, comment: schemas.CommentCreate, author_id: int):
        return self.comment_repo.create_comment(db, content=comment.content, task_id=comment.task_id, author_id=author_id)

    def get_comments_by_task(self, db: Session, task_id: int):
        return self.comment_repo.get_comments_by_task(db, task_id)
