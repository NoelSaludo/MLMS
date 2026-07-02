from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.dependency import get_db
from services.login_service import login_user

router = APIRouter(prefix="/login")

@router.post("/")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = login_user(db, email, password)

    if user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "user": user}