from sqlalchemy.orm import Session
import models

class CommentRepository:
    def create_comment(self, db: Session, content: str, task_id: int, author_id: int):
        db_comment = models.Comment(
            content=content,
            task_id=task_id,
            author_id=author_id
        )
        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment

    def get_comments_by_task(self, db: Session, task_id: int):
        return db.query(models.Comment).filter(models.Comment.task_id == task_id).all()
