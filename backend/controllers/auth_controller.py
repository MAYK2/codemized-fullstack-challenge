from fastapi import APIRouter, Depends, Response, Request, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from services.auth_service import AuthService
import os

router = APIRouter(tags=["Authentication"])
auth_service = AuthService()

COOKIE_NAME = "token"
COOKIE_MAX_AGE = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")) * 60  # segundos


@router.post("/login")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    access_token = auth_service.login(db, form_data.username, form_data.password)

    response.set_cookie(
        key=COOKIE_NAME,
        value=access_token,
        httponly=True,          # JS no puede leerla
        samesite="lax",         # Protección CSRF básica
        secure=False,           # Cambiar a True en producción con HTTPS
        max_age=COOKIE_MAX_AGE,
        path="/",
    )
    return {"message": "Login exitoso"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key=COOKIE_NAME, path="/")
    return {"message": "Sesión cerrada"}