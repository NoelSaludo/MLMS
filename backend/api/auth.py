from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from services.auth_service import create_access_token
from database.dependency import get_db
from model.user import User
import bcrypt

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/login")
async def login(req: dict, db: Session = Depends(get_db)):
    email = req.get("email")
    password = req.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    user = db.query(User).filter(User.email == email).first()

    if not user or not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    cat = create_access_token({"sub": user.email})

    return {"access_token": cat, "token_type": "bearer"}

@router.get("/logout")
async def logout():
    pass
