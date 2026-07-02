from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.dependency import get_db
from services.course_service import get_users_courses


router = APIRouter(prefix="/course")

@router.get("/courses/all/{user_id}")
def get_courses(user_id: int, db: Session = Depends(get_db)):
    courses = get_users_courses(db, user_id)
    if not courses:
        return {"message": "No courses found for the user."}

    return {"courses": courses}