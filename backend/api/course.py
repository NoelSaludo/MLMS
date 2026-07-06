from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.dependency import get_db


router = APIRouter(prefix="/course")

@router.get("/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db)):
    from services.course_service import get_course_by_id
    course = get_course_by_id(db, course_id)
    if course is None:
        return {"message": "Course not found."}
    return {"course": course}

@router.get("/{course_id}/contents")
def get_course_contents(course_id: int, db: Session = Depends(get_db)):
    from services.course_service import get_course_announcements
    announcements = get_course_announcements(db, course_id)
    if not announcements:
        return {"message": "No contents found for the course."}
    return {"contents": announcements}

@router.get("/{course_id}/materials")
def get_course_materials(course_id: int, db: Session = Depends(get_db)):
    from services.course_service import get_course_materials_by_id
    materials = get_course_materials_by_id(db, course_id)
    if not materials:
        return {"message": "No materials found for the course."}
    return {"materials": materials}