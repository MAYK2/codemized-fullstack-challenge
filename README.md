# Codemized Challenge - Task Management

Este proyecto es una solución **Full-Stack** diseñada para gestionar Proyectos, Tareas, Usuarios y Comentarios.
## 🚀 Arquitectura y Tecnologías

El sistema se diseñó bajo una **Arquitectura en Capas** enfocada en la escalabilidad, la separación de responsabilidades y las buenas prácticas modernas.

### Backend (FastAPI / Python)

La lógica se dividió estrictamente en tres niveles para garantizar el bajo acoplamiento:
1. **Controladores (`/controllers`)**: Únicamente gestionan las rutas HTTP, las validaciones Pydantic y los tokens JWT entrantes. Delegan todo el peso lógico.
2. **Servicios (`/services`)**: Contienen las reglas y lógica de negocio (encriptación de claves, prevenciones de duplicados, asignaciones lógicas).
3. **Repositorios (`/repositories`)**: Exclusivamente encargados de las consultas CRUD hacia la base de datos MariaDB usando SQLAlchemy. 

### Frontend (Next.js 15)
Se construyeron interfaces orientadas al usuario bajo una metodología de **UI Premium (Dark Theme + Glassmorphism)** sin depender de pesadas librerías de componentes (AntDesign, MUI), valiéndonos únicamente de la potencia de **Tailwind CSS V4 nativo**, garantizando una comprensión total del diseño por parte del desarrollador.

Todas las llamadas HTTP desde el cliente envían el token JWT (Bearer) a la API para validar la sesión activamente.

### Base de Datos
- **MariaDB** (Motor Relacional). Todas las entidades (User, Project, Task, Comment) tienen relaciones bien definidas (Foreign Keys y Relaciones de Cascada a nivel ORM).

## 🐋 Ejecución (Docker)

Todo el ambiente está correctamente dockerizado (Backend, Frontend y Base de Datos) y orquestado bajo la misma red local de Docker. 

Para levantar el proyecto completo no es necesario instalar dependencias manualmente, basta con ejecutar:

```bash
docker compose up --build
```

Esto inicializará:
1. `db`: Contenedor de MariaDB expuesto en puerto 3306.
2. `backend`: Servidor FastAPI alojado en `http://localhost:8000`. Creará sus tablas en DB al primer inicio.
3. `frontend`: Aplicación Next.js compilada estáticamente para producción, en `http://localhost:3000`.

### Consideraciones al Probar
- Registrar un usuario directamente desde `http://localhost:3000/register`.
- El flujo entero de login asignará y asegurará la sesión automáticamente.
- Las tareas creadas permiten especificar el "ID de asignado" interactuando plenamente con los endpoints provistos.
