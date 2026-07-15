import os
import sys

# Ensure backend directory is in the sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Set environment variables for config BEFORE importing anything
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["JWT_SECRET"] = "test_jwt_secret"
os.environ["REFRESH_SECRET"] = "test_refresh_secret"
os.environ["ALGORITHM"] = "HS256"

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import StaticPool

# Import models so SQLModel registry is aware of them
from model.user import User
from model.course import Course
from model.course_content import CourseContent
from model.course_member import CourseMember
from model.session import SessionModel

from main import app
from database.dependency import get_db

# Create a test engine with StaticPool to keep connection/tables alive in-memory
engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

@pytest.fixture(name="session")
def session_fixture():
    # Create the tables
    SQLModel.metadata.create_all(engine)

    # Open session
    with Session(engine) as session:
        yield session

    # Drop tables after test is done
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session):
    def get_db_override():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = get_db_override
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
