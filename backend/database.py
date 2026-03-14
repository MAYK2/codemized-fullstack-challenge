import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Leemos la URL de la base de datos que configuramos en el docker-compose.yml
# Si no la encuentra (por ejemplo, si corremos sin Docker), usa una de SQLite por defecto para evitar errores
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "mysql+pymysql://dev_user:dev_password@localhost:3306/task_manager_db"
)

# Creamos el "motor" que se conecta a MariaDB
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Creamos la fábrica de "sesiones" (cada vez que hagamos una consulta, abrimos una sesión)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Esta es la clase base de la que van a heredar todas nuestras tablas (User, Project, etc.)
Base = declarative_base()

# Función para inyectar la dependencia de la base de datos en los controladores (estilo Spring Boot)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()