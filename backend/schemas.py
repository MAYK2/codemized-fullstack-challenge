from pydantic import BaseModel, EmailStr

# ==========================
# SCHEMAS DE USUARIO
# ==========================

class UserCreate(BaseModel):
    email: EmailStr
    alias: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    alias: str
    class Config:
        from_attributes = True


# ==========================
# SCHEMAS DE PROYECTO
# ==========================

class ProjectCreate(BaseModel):
    title: str
    description: str | None = None

class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str | None
    creator_id: int

    class Config:
        from_attributes = True

# ==========================
# SCHEMAS DE TAREA
# ==========================

class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    project_id: int
    assignee_id: int | None = None
    status: str = "pending"

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    project_id: int
    assignee_id: int | None
    status: str

    class Config:
        from_attributes = True

# ==========================
# SCHEMAS DE COMENTARIO
# ==========================

class CommentCreate(BaseModel):
    content: str
    task_id: int

class CommentAuthor(BaseModel):
    alias: str
    class Config:
        from_attributes = True

class CommentResponse(BaseModel):
    id: int
    content: str
    task_id: int
    author_id: int
    author: CommentAuthor

    class Config:
        from_attributes = True