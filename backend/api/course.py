from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session
from model.course_content import CourseContent
from database.dependency import get_db
from services.file_service import save_file
from services.course_service import (
    get_course_by_id,
    get_course_contents,
    get_course_materials_by_id,
    get_course_members,
    create_course_content,
    create_course,
    add_course_member,
    get_content_detail_by_id
)

router = APIRouter(prefix="/course", tags=["Course"])

@router.get("/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = get_course_by_id(db, course_id)
    if course is None:
        return {"message": "Course not found."}

    return {"course": course}

@router.get("/{course_id}/contents")
def get_course_contents_route(course_id: int, db: Session = Depends(get_db)):
    contents = get_course_contents(db, course_id)
    if not contents:
        return {"message": "No contents found for the course."}

    return {"contents": contents}

@router.get("/{course_id}/materials")
def get_course_materials_route(course_id: int, db: Session = Depends(get_db)):
    materials = get_course_materials_by_id(db, course_id)

    if not materials:
        return {"message": "No materials found for the course."}

    return {"materials": materials}

@router.post("/{course_id}/materials")
def upload_course_material(course_id: int,
                         title: Annotated[str, Form(...)],
                         description: Annotated[str, Form(...)],
                         filepath_attachment: Annotated[str, Form(...)],
                         db: Session = Depends(get_db)):
    try:
        material = {"title": title,
            "description": description,
            "type": "material",
            "filepath_attachment": filepath_attachment,
            "score": None,
            "due_date": None}

        create_course_content(db, course_id, material)

        return {"message": "Material uploaded successfully.", "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while uploading the material: {str(e)}")


@router.post("/{course_id}/announcement")
def make_announcement(course_id: int, title: str = Form(...), content: str = Form(...), db: Session = Depends(get_db)):
    announcement_data = {"title": title,
        "description": content,
        "type": "announcement",
        "filepath_attachment": None,
        "score": None,
        "due_date": None}
    create_course_content(db, course_id, announcement_data)

    return {"message": "Announcement created successfully.", "status": "success"}

@router.get("/{course_id}/members")
def get_course_members_route(course_id: int, db: Session = Depends(get_db)):
    members = get_course_members(db, course_id)
    if not members:
        return {"message": "No members found for the course."}

    return {"members": members}

class CourseContentCreateRequest(BaseModel):
    title: str
    description: str
    type: str  # e.g., 'announcement', 'material', 'assignment'
    filepath_attachment: Optional[str] = None  # URL to the content if applicable
    score: Optional[int] = None # Score for quizzes or assessments
    due_date: Optional[str] = None # Due date for assignments or quizzes in 'YYYY-MM-DD' format

@router.post("/{course_id}/contents/")
async def create_course_content_route(course_id: int, data: Annotated[CourseContentCreateRequest, Form()], db: Session = Depends(get_db)):
    print(f"Received data: {data}")
    content = create_course_content(db, course_id, data)
    return content 

class CourseCreateRequest(BaseModel):
    title: str
    description: str
    syllabus_file_path: str
    start_date: str
    end_date: str
    status: str
    instructor_id: int

@router.post("/create/")
async def create_course_route(course_data: CourseCreateRequest, db: Session = Depends(get_db)):
    course = create_course(db, course_data)
    add_course_member(db, course.course_id, course_data.instructor_id)
    return course

@router.get("/content/")
async def get_content_detail_by_id_route(course_id: int = Query(..., alias="courseId"), content_id: int = Query(..., alias="contentId"), db: Session = Depends(get_db)):
    content = get_content_detail_by_id(db, course_id, content_id)
    if content is None:
        raise HTTPException(status_code=404, detail="Content not found")
    return content
