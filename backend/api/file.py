import os

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from fastapi.responses import FileResponse
from services.file_service import save_file

router = APIRouter(prefix="/file", tags=["file"])

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...), course_title: str = Form(...)):
    return await save_file(file, file.filename, course_title)


@router.get("/download")
async def download_file(file_path: str = Query(...)):
    normalized_path = os.path.normpath(file_path)
    uploads_root = os.path.abspath("uploads")
    absolute_path = os.path.abspath(normalized_path)

    if not absolute_path.startswith(uploads_root + os.sep) and absolute_path != uploads_root:
        raise HTTPException(status_code=400, detail="Invalid file path")

    if not os.path.exists(absolute_path) or not os.path.isfile(absolute_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(absolute_path, filename=os.path.basename(absolute_path))