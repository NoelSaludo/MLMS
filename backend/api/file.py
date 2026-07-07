from fastapi import APIRouter, UploadFile, File, Form
from services.file_service import save_file

router = APIRouter(prefix="/file", tags=["file"])

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...), course_title: str = Form(...)):
    return await save_file(file, file.filename, course_title)