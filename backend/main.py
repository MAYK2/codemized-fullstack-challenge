from fastapi import FastAPI
from database import engine
import models
from fastapi.middleware.cors import CORSMiddleware

from controllers import user_controller, project_controller, task_controller, auth_controller, comment_controller

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Codemized Task Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://100.83.82.124:3000", "http://169.254.83.107:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_controller.router)
app.include_router(project_controller.router)
app.include_router(task_controller.router)
app.include_router(auth_controller.router)
app.include_router(comment_controller.router)
@app.get("/")
def read_root():
    return {"status": "Backend funcionando", "framework": "FastAPI", "db": "Tablas creadas"}