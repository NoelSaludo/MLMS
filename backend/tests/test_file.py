import os
import shutil
import pytest

def test_upload_file(client):
    # Ensure cleanup
    shutil.rmtree("uploads/test_course_uploads", ignore_errors=True)

    # Test file upload
    file_content = b"test content"
    files = {"file": ("test_file.txt", file_content, "text/plain")}
    data = {"course_title": "test_course_uploads"}

    response = client.post("/file/upload/", files=files, data=data)
    assert response.status_code == 200
    res_data = response.json()
    assert "file_path" in res_data
    assert "test_course_uploads" in res_data["file_path"]
    assert "test_file.txt" in res_data["file_path"]

    # Verify file was written to disk
    assert os.path.exists(res_data["file_path"])
    with open(res_data["file_path"], "rb") as f:
        assert f.read() == file_content

    # Cleanup
    shutil.rmtree("uploads/test_course_uploads", ignore_errors=True)

def test_download_file_success(client):
    # Setup: Create a file to download
    os.makedirs("uploads/test_course_downloads", exist_ok=True)
    file_path = "uploads/test_course_downloads/sample.txt"
    file_content = b"sample download content"
    with open(file_path, "wb") as f:
        f.write(file_content)

    response = client.get("/file/download", params={"file_path": file_path})
    assert response.status_code == 200
    assert response.content == file_content

    # Cleanup
    shutil.rmtree("uploads/test_course_downloads", ignore_errors=True)

def test_download_file_invalid_path(client):
    # Path traversal attempt
    response = client.get("/file/download", params={"file_path": "backend/main.py"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid file path"

def test_download_file_not_found(client):
    response = client.get("/file/download", params={"file_path": "uploads/non_existent_file_xyz.txt"})
    assert response.status_code == 404
    assert response.json()["detail"] == "File not found"
