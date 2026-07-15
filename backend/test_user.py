# This test will check if the routes used for login are working 
# properly and returning the expected responses.
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_user_by_email():
    test_email = "johndoe@email.com"
    # Test with a valid email
    response = client.get(f"/user/{test_email}")
    assert response.status_code == 200
    assert "user" in response.json()

def test_get_users_courses():
    test_user_id = 1
    # Test with a valid user ID
    response = client.get(f"/user/{test_user_id}/courses")
    assert response.status_code == 200
    assert "courses" in response.json()