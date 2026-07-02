from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.dependency import get_db
from services.user_service import get_user

router = APIRouter(prefix="/user")

@router.get("/{email}")
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = get_user(db, email)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User found", "user": user}