from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

route = "/course"

def test_get_course():
    test_course_id = 1
    response = client.get(f"{route}/{test_course_id}")
    assert response.status_code == 200
    assert "course" in response.json()

def test_get_course_contents():
    test_course_id = 1
    response = client.get(f"{route}/{test_course_id}/contents")
    assert response.status_code == 200
    assert "contents" in response.json()

def test_get_course_content_detail():
    test_course_id = 1
    test_content_id = 1
    response = client.get(f"{route}/{test_course_id}/contents/{test_content_id}")
    assert response.status_code == 200
    assert "content" in response.json()

def test_get_course_materials():
    test_course_id = 1
    response = client.get(f"{route}/{test_course_id}/materials")
    assert response.status_code == 200
    assert "materials" in response.json()

def test_upload_course_material():
    test_course_id = 1
    data = {
        "title": "Test Material",
        "description": "This is a test material.",
        "filepath_attachment": "/path/to/test_material.pdf"
    }
    response = client.post(f"{route}/{test_course_id}/materials", data=data)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_make_announcement():
    test_course_id = 1
    data = {
        "title": "Test Announcement",
        "content": "This is a test announcement."
    }
    response = client.post(f"{route}/{test_course_id}/announcement", data=data)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_make_assignment():
    test_course_id = 1
    data = {
        "title": "Test Assignment",
        "description": "This is a test assignment.",
        "score": 100,
        "due_date": "2024-12-31"
    }
    response = client.post(f"{route}/{test_course_id}/assignment", data=data)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_get_course_members():
    test_course_id = 1
    response = client.get(f"{route}/{test_course_id}/members")
    assert response.status_code == 200
    assert "members" in response.json()

def test_create_course():
    data = {
        "title": "Test Course",
        "description": "This is a test course.",
        "instructor_id": 1,
        "syllabus_file_path": "/path/to/test_syllabus.pdf",
        "start_date": "2024-01-01",
        "end_date": "2024-06-01",
        "status": "active"
    }
    response = client.post(f"{route}/", data=data)
    assert response.status_code == 200
    assert "course" in response.json()

def test_get_course_content_detail():
    test_course_id = 1
    test_content_id = 1
    response = client.get(f"{route}/{test_course_id}/contents/{test_content_id}")
    assert response.status_code == 200
    assert "content" in response.json()