from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.dependency import get_db

router = APIRouter(prefix="/health")

@router.get("/")
def check_health(db: Session = Depends(get_db)):
    return {
            "server": "is active",
            "database connection": db.is_active
            }