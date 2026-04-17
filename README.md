# Codemized Challenge — Task Management

Solución Full-Stack para el challenge de Codemized. Aplicación de gestión de proyectos y tareas con autenticación segura, arquitectura en capas y despliegue containerizado.

## 🚀 Inicio Rápido

```bash
git clone <repo-url>
cd codemized-challenge
docker compose up --build
```

Eso es todo. La aplicación estará disponible en:

| Servicio | URL |
|---|---|
| Frontend (UI) | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |

**Flujo inicial:** Registrar un usuario en `/register` → Login → Crear proyectos → Crear tareas y asignarlas a otros usuarios → Comentar en las tareas.

---

## 🗺️ Arquitectura

```
codemized-challenge/
├── docker-compose.yml        ← Orquesta los 3 servicios
├── backend/                  ← FastAPI (Python 3.11)
│   ├── controllers/          ← Rutas HTTP (capa de entrada)
│   ├── services/             ← Lógica de negocio (cerebro)
│   ├── repositories/         ← Acceso a datos (capa de datos)
│   ├── models.py             ← Modelos SQLAlchemy
│   ├── schemas.py            ← Validación Pydantic
│   └── auth.py               ← JWT + bcrypt + httpOnly cookies
└── frontend/                 ← Next.js 15
    └── app/
        ├── page.tsx          ← Dashboard (lista de proyectos)
        ├── login/            ← Autenticación
        ├── register/         ← Registro de usuario
        ├── project/[id]/     ← Tareas del proyecto + asignación
        └── task/[id]/        ← Comentarios de la tarea
```

### Stack Técnico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11, SQLAlchemy ORM |
| Base de datos | MariaDB (relacional, con FK y cascade) |
| Autenticación | JWT firmado con HS256, httpOnly cookies |
| Infraestructura | Docker Compose, healthcheck en MariaDB |

---

## 🏛️ Arquitectura en Capas (Backend)

La lógica del backend está estrictamente separada en 3 capas:

1. **Controladores** (`/controllers`): Solo gestionan rutas HTTP, delegan toda la lógica.
2. **Servicios** (`/services`): Aplican las reglas de negocio (validaciones, permisos, asignaciones).
3. **Repositorios** (`/repositories`): Realizan exclusivamente las consultas CRUD contra MariaDB via SQLAlchemy.

Esto garantiza bajo acoplamiento: cambiar la DB no afecta al service, cambiar el protocolo no afecta al repositorio.

---

## 🗃️ Modelo de Datos

```
users ──────────── crea ──────────────► projects
  │                                         │
  │                                    contiene (cascade)
  │                                         │
  └─── es asignado a ──────────────► tasks ◄── pertenece a── projects
                                       │
                                  tiene (cascade)
                                       │
                                   comments ◄── escrito por── users
```

---

## 🔐 Seguridad

- **Passwords**: hasheados con `bcrypt` (nunca texto plano en DB)
- **Sesiones**: JWT almacenado como `httpOnly cookie` (inaccesible desde JavaScript — protección contra XSS)
- **SQL Injection**: prevenido automáticamente por SQLAlchemy ORM (parámetros enlazados)
- **Autorización**: solo el creador de un proyecto puede crear y asignar tareas en él (HTTP 403 en caso contrario)

---

## 📡 Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/users/` | Registrar usuario |
| GET | `/users/me` | Perfil del usuario autenticado |
| GET | `/users/` | Listar todos los usuarios (para asignación) |
| POST | `/login` | Login → setea httpOnly cookie |
| POST | `/logout` | Cierra sesión → borra cookie |
| POST | `/projects/` | Crear proyecto |
| GET | `/projects/my-projects` | Proyectos del usuario autenticado |
| POST | `/tasks/` | Crear tarea (se auto-asigna al creador si no se especifica asignado) |
| GET | `/tasks/project/{id}` | Listar tareas de un proyecto |
| PATCH | `/tasks/{id}/assign` | Asignar o re-asignar tarea a un usuario |
| POST | `/comments/` | Crear comentario en una tarea |
| GET | `/comments/task/{id}` | Listar comentarios de una tarea |
