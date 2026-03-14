from pydantic import BaseModel, EmailStr

# ==========================
# SCHEMAS DE USUARIO
# ==========================

# 1. Lo que le exigimos al frontend cuando alguien se registra
class UserCreate(BaseModel):
    email: EmailStr
    alias: str
    password: str

# 2. Lo que le devolvemos al frontend (¡Sin la contraseña!)
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    alias: str
    # Esta configuración es clave: le permite a Pydantic leer los datos 
    # directamente desde el modelo de base de datos de SQLAlchemy
    class Config:
        from_attributes = True


# ==========================
# SCHEMAS DE PROYECTO
# ==========================

class ProjectCreate(BaseModel):
    title: str
    description: str | None = None # El None significa que es opcional

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

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    project_id: int
    assignee_id: int | None

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