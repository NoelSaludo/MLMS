from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.dependency import get_db
from services.course_service import get_users_courses


router = APIRouter(prefix="/course")

@router.get("/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db)):
    from services.course_service import get_course_by_id
    course = get_course_by_id(db, course_id)
    if course is None:
        return {"message": "Course not found."}
    return {"course": course}

@router.get("/{course_id}/announcements")
def get_course_announcements(course_id: int, db: Session = Depends(get_db)):
    from services.course_service import get_course_announcements
    announcements = get_course_announcements(db, course_id)
    if not announcements:
        return {"message": "No announcements found for the course."}
    return {"announcements": announcements}