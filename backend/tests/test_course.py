import pytest
from datetime import date
from model.course import Course
from model.user import User
from model.course_content import CourseContent
from model.course_member import CourseMember

def test_get_course_success(client, session):
    # Seed a course
    course = Course(
        title="Software Engineering",
        description="Learn SE principles",
        syllabus_file_path="uploads/se/syllabus.pdf",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 6, 1),
        status="active"
    )
    session.add(course)
    session.commit()

    response = client.get(f"/course/{course.course_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["course"]["title"] == "Software Engineering"

def test_get_course_not_found(client):
    response = client.get("/course/999")
    assert response.status_code == 200
    assert response.json()["message"] == "Course not found."

def test_get_course_contents(client, session):
    # Seed a course and course contents
    course = Course(
        title="SE",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 6, 1),
        status="active"
    )
    session.add(course)
    session.commit()

    content = CourseContent(
        course_id=course.course_id,
        title="Introduction",
        description="Introduction to SE",
        type="announcement"
    )
    session.add(content)
    session.commit()

    response = client.get(f"/course/{course.course_id}/contents")
    assert response.status_code == 200
    data = response.json()
    assert len(data["contents"]) == 1
    assert data["contents"][0]["title"] == "Introduction"

def test_get_course_contents_not_found(client):
    response = client.get("/course/999/contents")
    assert response.status_code == 200
    assert response.json()["message"] == "No contents found for the course."

def test_get_course_content_detail(client, session):
    course = Course(
        title="SE",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 6, 1),
        status="active"
    )
    session.add(course)
    session.commit()

    content = CourseContent(
        course_id=course.course_id,
        title="Intro",
        description="Desc",
        type="announcement"
    )
    session.add(content)
    session.commit()

    response = client.get(f"/course/{course.course_id}/content/{content.content_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["content"]["title"] == "Intro"

def test_get_course_content_detail_not_found(client):
    response = client.get("/course/1/content/999")
    assert response.status_code == 200
    assert response.json()["message"] == "Content not found."

def test_get_course_materials(client, session):
    course = Course(
        title="SE",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 6, 1),
        status="active"
    )
    session.add(course)
    session.commit()

    material = CourseContent(
        course_id=course.course_id,
        title="Syllabus PDF",
        description="Course syllabus",
        type="material"
    )
    announcement = CourseContent(
        course_id=course.course_id,
        title="Hello",
        description="Greeting",
        type="announcement"
    )
    session.add(material)
    session.add(announcement)
    session.commit()

    response = client.get(f"/course/{course.course_id}/materials")
    assert response.status_code == 200
    data = response.json()
    assert len(data["materials"]) == 1
    assert data["materials"][0]["title"] == "Syllabus PDF"

def test_get_course_materials_not_found(client):
    response = client.get("/course/999/materials")
    assert response.status_code == 200
    assert response.json()["message"] == "No materials found for the course."

def test_upload_course_material(client, session):
    course = Course(
        title="SE",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 6, 1),
        status="active"
    )
    session.add(course)
    session.commit()

    # Form post to /course/{course_id}/materials
    response = client.post(
        f"/course/{course.course_id}/materials",
        data={
            "title": "Ch 1 Slide",
            "description": "Chapter 1 presentation",
            "filepath_attachment": "uploads/se/ch1.pdf"
        }
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Material uploaded successfully."

    # Verify CourseContent is saved
    materials = session.query(CourseContent).filter(CourseContent.course_id == course.course_id).all()
    assert len(materials) == 1
    assert materials[0].title == "Ch 1 Slide"
    assert materials[0].type == "material"

def test_make_announcement(client, session):
    course = Course(
        title="SE",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 6, 1),
        status="active"
    )
    session.add(course)
    session.commit()

    # Form post to /course/{course_id}/announcement
    response = client.post(
        f"/course/{course.course_id}/announcement",
        data={
            "title": "Holiday Announcement",
            "content": "No classes on Friday."
        }
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Announcement created successfully."

    announcements = session.query(CourseContent).filter(CourseContent.course_id == course.course_id).all()
    assert len(announcements) == 1
    assert announcements[0].title == "Holiday Announcement"
    assert announcements[0].type == "announcement"

def test_assign_assignment(client, session):
    course = Course(
        title="SE",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 6, 1),
        status="active"
    )
    session.add(course)
    session.commit()

    response = client.post(
        f"/course/{course.course_id}/assignment",
        data={
            "title": "Lab 1",
            "description": "Git assignment",
            "filepath_attachment": "uploads/se/lab1.pdf",
            "score": 100,
            "due_date": "2026-02-15"
        }
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Assignment created successfully."

    assignments = session.query(CourseContent).filter(CourseContent.course_id == course.course_id).all()
    assert len(assignments) == 1
    assert assignments[0].title == "Lab 1"
    assert assignments[0].type == "assignment"
    assert assignments[0].score == 100
    assert assignments[0].due_date == date(2026, 2, 15)

def test_get_course_members(client, session):
    course = Course(
        title="SE",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 6, 1),
        status="active"
    )
    user1 = User(full_name="Alice", email="alice@example.com", password="pwd", role="student")
    user2 = User(full_name="Bob", email="bob@example.com", password="pwd", role="student")
    session.add(course)
    session.add(user1)
    session.add(user2)
    session.commit()

    member1 = CourseMember(course_id=course.course_id, user_id=user1.user_id)
    member2 = CourseMember(course_id=course.course_id, user_id=user2.user_id)
    session.add(member1)
    session.add(member2)
    session.commit()

    response = client.get(f"/course/{course.course_id}/members")
    assert response.status_code == 200
    data = response.json()
    assert len(data["members"]) == 2
    assert {m["full_name"] for m in data["members"]} == {"Alice", "Bob"}

def test_get_course_members_not_found(client):
    response = client.get("/course/999/members")
    assert response.status_code == 200
    assert response.json()["message"] == "No members found for the course."

def test_create_course_route(client, session):
    # Seed user as instructor
    user = User(full_name="Dr. Smith", email="smith@example.com", password="pwd", role="instructor")
    session.add(user)
    session.commit()

    # The frontend sends fields individually using FormData.
    # Let's test if FastAPI parses form fields individually for CourseCreateRequest
    response = client.post(
        "/course/create",
        data={
            "title": "Operating Systems",
            "description": "Learn OS kernels",
            "syllabus_file_path": "uploads/os/syllabus.pdf",
            "start_date": "2026-01-01",
            "end_date": "2026-06-01",
            "status": "active",
            "instructor_id": user.user_id
        }
    )
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["message"] == "Course created successfully."
    assert "course_id" in res_data

    # Verify course and member are in DB
    created_course = session.query(Course).filter(Course.course_id == res_data["course_id"]).first()
    assert created_course is not None
    assert created_course.title == "Operating Systems"

    created_member = session.query(CourseMember).filter(
        CourseMember.course_id == res_data["course_id"],
        CourseMember.user_id == user.user_id
    ).first()
    assert created_member is not None

def test_create_course_content_route(client, session):
    course = Course(
        title="SE",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 6, 1),
        status="active"
    )
    session.add(course)
    session.commit()

    # Call POST /course/{course_id}/contents/
    response = client.post(
        f"/course/{course.course_id}/contents/",
        data={
            "title": "Content 1",
            "description": "Content description",
            "type": "announcement",
            "filepath_attachment": "uploads/se/content1.pdf",
            "score": 0,
            "due_date": "2026-03-01"
        }
    )
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["title"] == "Content 1"
    assert res_data["type"] == "announcement"

    # Verify content is in DB
    content = session.query(CourseContent).filter(CourseContent.content_id == res_data["content_id"]).first()
    assert content is not None
    assert content.title == "Content 1"
    assert content.due_date == date(2026, 3, 1)

def test_get_content_detail_by_id_route(client, session):
    course = Course(
        title="SE",
        start_date=date(2026, 1, 1),
        end_date=date(2026, 6, 1),
        status="active"
    )
    session.add(course)
    session.commit()

    content = CourseContent(
        course_id=course.course_id,
        title="Special Content",
        description="Very special",
        type="material"
    )
    session.add(content)
    session.commit()

    response = client.get(f"/course/content/?courseId={course.course_id}&contentId={content.content_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Special Content"

def test_get_content_detail_by_id_route_not_found(client):
    response = client.get("/course/content/?courseId=1&contentId=999")
    assert response.status_code == 404
