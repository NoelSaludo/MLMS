from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from model.session import SessionModel
from services.auth_service import create_jwt, create_refresh_jwt, save_refresh_token
from database.dependency import get_db
from model.user import User
import bcrypt

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/login")
async def login(data: Annotated[dict, Form], db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    user = db.query(User).filter(User.email == email).first()

    if not user or not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    jwt = create_jwt({"sub": user.email, "id": user.user_id, "role": user.role}, expires_delta=timedelta(minutes=5))
    rt = create_refresh_jwt({"sub": user.email}, expires_delta=timedelta(days=7))

    save_refresh_token(user.user_id, rt, db)


    return {"access_token": jwt, "refresh_token": rt}
