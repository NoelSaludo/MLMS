import pytest
import bcrypt
from model.user import User
from model.session import SessionModel
from services.auth_service import create_jwt

def test_login_success(client, session):
    # Seed a user
    hashed_password = bcrypt.hashpw("password123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = User(full_name="John Doe", email="john@example.com", password=hashed_password, role="student")
    session.add(user)
    session.commit()

    # Successful login
    response = client.post("/auth/login", json={"email": "john@example.com", "password": "password123"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"

    # Verify session is saved in the DB
    stored_session = session.query(SessionModel).filter(SessionModel.user_id == user.user_id).first()
    assert stored_session is not None
    assert stored_session.refresh_token == data["refresh_token"]

def test_login_missing_fields(client, session):
    # Missing email
    response = client.post("/auth/login", json={"password": "password123"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Email and password are required"

    # Missing password
    response = client.post("/auth/login", json={"email": "john@example.com"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Email and password are required"

def test_login_invalid_credentials(client, session):
    # Seed a user
    hashed_password = bcrypt.hashpw("password123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = User(full_name="John Doe", email="john@example.com", password=hashed_password, role="student")
    session.add(user)
    session.commit()

    # Non-existent email
    response = client.post("/auth/login", json={"email": "wrong@example.com", "password": "password123"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

    # Incorrect password
    response = client.post("/auth/login", json={"email": "john@example.com", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

def test_refresh_token_success(client, session):
    # Seed user and user session
    hashed_password = bcrypt.hashpw("password123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = User(full_name="John Doe", email="john@example.com", password=hashed_password, role="student")
    session.add(user)
    session.commit()

    # Create tokens manually or via login
    login_response = client.post("/auth/login", json={"email": "john@example.com", "password": "password123"})
    assert login_response.status_code == 200
    login_data = login_response.json()
    access_token = login_data["access_token"]

    # Call /auth/refresh with Bearer Authorization header
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get("/auth/refresh", headers=headers)
    assert response.status_code == 200
    refresh_data = response.json()
    assert "access_token" in refresh_data
    assert "refresh_token" in refresh_data

def test_refresh_token_invalid_access_token(client):
    # Invalid access token
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get("/auth/refresh", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid access token"

def test_refresh_token_no_session(client, session):
    # Seed user but no session
    hashed_password = bcrypt.hashpw("password123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = User(full_name="John Doe", email="john@example.com", password=hashed_password, role="student")
    session.add(user)
    session.commit()

    # Generate an access token for user
    access_token = create_jwt({"sub": user.email, "id": user.user_id, "role": user.role})

    # Call /auth/refresh (fails because no session is in DB)
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get("/auth/refresh", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "No session found for user"
