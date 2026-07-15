from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_login():
    data = {
        "email": "johndoe@email.com",
        "password": "qwerty123",
    }
    response = client.post("/auth/login", data=data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "refresh_token" in response.json()
