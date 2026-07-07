from typing import Annotated

from fastapi import APIRouter, Depends, Form
from pydantic import BaseModel
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
    from services.course_service import get_course_contents
    contents = get_course_contents(db, course_id)
    if not contents:
        return {"message": "No contents found for the course."}
    return {"contents": contents}

@router.get("/{course_id}/materials")
def get_course_materials(course_id: int, db: Session = Depends(get_db)):
    from services.course_service import get_course_materials_by_id
    materials = get_course_materials_by_id(db, course_id)
    if not materials:
        return {"message": "No materials found for the course."}
    return {"materials": materials}

@router.get("/{course_id}/members")
def get_course_members(course_id: int, db: Session = Depends(get_db)):
    from services.course_service import get_course_members
    members = get_course_members(db, course_id)
    if not members:
        return {"message": "No members found for the course."}
    return {"members": members}

class CourseContentCreateRequest(BaseModel):
    title: str
    description: str
    type: str  # e.g., 'announcement', 'material', 'assignment'
    filepathAttachment: str = None  # URL to the content if applicable
    score: int  = None # Score for quizzes or assessments
    dueDate: str = None # Due date for assignments or quizzes in 'YYYY-MM-DD' format

@router.post("/{course_id}/contents/")
async def create_course_content(course_id: int, data: Annotated[CourseContentCreateRequest, Form()], db: Session = Depends(get_db)):
    from services.course_service import create_course_content
    print(f"Received data: {data}")
    content = create_course_content(db, course_id, data)
    return content 

class CourseCreateRequest(BaseModel):
    title: str
    description: str
    fileattachment: str
    startDate: str
    endDate: str
    status: str

@router.post("/create/")
async def create_course(course_data: CourseCreateRequest, db: Session = Depends(get_db)):
    from services.course_service import create_course
    course = create_course(db, course_data)
    return course