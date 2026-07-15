from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

test_file_name = "test_file.txt"
test_file_path = f"/tmp/{test_file_name}"
test_file_content = "This is a test file."

def test_file_upload():
    # Test with a valid file upload
    with open(test_file_path, "w") as f:
        f.write(test_file_content)
    with open(test_file_path, "rb") as f:
        response = client.post(
            "/file/upload/",
            files={"file": (test_file_name, f, "text/plain")},
            data={"course_title": "Test Course"}
        )

    assert response.status_code == 200
    assert "file_path" in response.json()

def test_file_download():
    # Upload the file first to get a valid path within uploads/
    with open(test_file_path, "w") as f:
        f.write(test_file_content)
    with open(test_file_path, "rb") as f:
        upload_response = client.post(
            "/file/upload/",
            files={"file": (test_file_name, f, "text/plain")},
            data={"course_title": "Test Course"}
        )
    assert upload_response.status_code == 200
    saved_path = upload_response.json()["file_path"]

    # Download using the correct query-param format
    response = client.get("/file/download", params={"file_path": saved_path})
    assert response.status_code == 200
    assert response.content == test_file_content.encode()

