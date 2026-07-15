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
        response = client.post("/file/upload", files={"file": (test_file_name, f, "text/plain")})

    assert response.status_code == 200
    assert "filename" in response.json()
    assert response.json()["filename"] == test_file_name

def test_file_download():
    # Test with a valid file download
    response = client.get(f"/file/download/{test_file_name}")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/octet-stream"
    assert response.content == b"This is a test file."

