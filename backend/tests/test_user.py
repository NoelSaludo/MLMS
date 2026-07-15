import pytest
from datetime import date
from model.user import User
from model.course import Course
from model.course_member import CourseMember

def test_get_user_by_email_success(client, session):
    user = User(full_name="Alice", email="alice@example.com", password="pwd", role="student")
    session.add(user)
    session.commit()

    response = client.get("/user/alice@example.com")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "User found"
    assert data["user"]["full_name"] == "Alice"

def test_get_user_by_email_not_found(client):
    response = client.get("/user/nonexistent@example.com")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"

def test_get_user_courses_success(client, session):
    user = User(full_name="Alice", email="alice@example.com", password="pwd", role="student")
    session.add(user)
    session.commit()

    course1 = Course(
        title="Software Engineering",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 6, 1),
        status="active"
    )
    course2 = Course(
        title="Algorithms",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 6, 1),
        status="active"
    )
    session.add(course1)
    session.add(course2)
    session.commit()

    member1 = CourseMember(course_id=course1.course_id, user_id=user.user_id)
    member2 = CourseMember(course_id=course2.course_id, user_id=user.user_id)
    session.add(member1)
    session.add(member2)
    session.commit()

    response = client.get(f"/user/{user.user_id}/courses")
    assert response.status_code == 200
    data = response.json()
    assert "courses" in data
    assert len(data["courses"]) == 2
    assert {c["title"] for c in data["courses"]} == {"Software Engineering", "Algorithms"}

def test_get_user_courses_no_courses(client, session):
    user = User(full_name="Alice", email="alice@example.com", password="pwd", role="student")
    session.add(user)
    session.commit()

    response = client.get(f"/user/{user.user_id}/courses")
    assert response.status_code == 200
    assert response.json()["message"] == "No courses found for the user."
