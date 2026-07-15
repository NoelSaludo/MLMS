from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from model.session import SessionModel
from services.auth_service import create_jwt, create_refresh_jwt, save_refresh_token, check_jwt_validity
from database.dependency import get_db
from model.user import User
from fastapi.security import HTTPBearer
import bcrypt

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)
security = HTTPBearer()

@router.post("/login")
async def login(email:Annotated[str, Form(...)], password: Annotated[str, Form(...)], db: Session = Depends(get_db)):
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    user = db.query(User).filter(User.email == email).first()

    if not user or not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return create_tokens({"sub": user.email, "id": user.user_id, "role": user.role}, db)


@router.get("/refresh")
def refresh_token(authorization: Annotated[str, Depends(security)], db: Session = Depends(get_db)):
    access_token = authorization.credentials
    is_valid, payload = check_jwt_validity(access_token)

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid access token")

    user_id = payload.get("id")
    session = db.query(SessionModel).filter(SessionModel.user_id == user_id).first()

    if not session:
        raise HTTPException(status_code=401, detail="No session found for user")
    
    return create_tokens({"sub": payload.get("sub"), "id": user_id, "role": payload.get("role")}, db)

def create_tokens(payload: dict, db: Session):
    access_token = create_jwt(payload, expires_delta=timedelta(minutes=5))
    refresh_token = create_refresh_jwt({"sub": payload.get("sub")}, expires_delta=timedelta(days=7))

    save_refresh_token(payload.get("id"), refresh_token, db)

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}