import os

async def save_file(file, filename, course_title):
    course_dir = os.path.join("uploads", course_title)
    os.makedirs(course_dir, exist_ok=True)
    
    file_path = os.path.join(course_dir, filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    return {"file_path": file_path}