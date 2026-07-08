from sqlalchemy.orm import Session
from model.course import Course
from model.user import User
from model.course_member import CourseMember
from model.course_content import CourseContent

def get_courses_members(db: Session, user_id: int):
    courses = db.query(Course).filter(
        Course.course_id.in_(
            db.query(CourseMember.course_id).filter(CourseMember.user_id == user_id)
            )).all()
    return courses

def get_course_by_id(db: Session, course_id: int):
    course = db.query(Course).filter(Course.course_id == course_id).first()
    return course

def get_course_contents(db: Session, course_id: int):
    course_contents = db.query(CourseContent).filter(
        CourseContent.course_id == course_id).all()
    return course_contents

def get_course_materials_by_id(db: Session, course_id: int):
    course_materials = db.query(CourseContent).filter(
        CourseContent.course_id == course_id,
        CourseContent.type == 'material'
    ).all()
    return course_materials

def get_course_members(db: Session, course_id: int):
    members = db.query(User).select_from(CourseMember).join(User, CourseMember.user_id == User.user_id).filter(
        CourseMember.course_id == course_id
    ).all()
    return members

def create_course_content(db: Session, course_id: int, content_data):
    if not isinstance(content_data, dict):
        content_data = content_data.model_dump()

    content_data['course_id'] = course_id
    new_content = CourseContent.model_validate(content_data)

    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    return new_content

def create_course(db: Session, course_data):
    if not isinstance(course_data, dict):
        course_data = course_data.model_dump()

    new_course = Course.model_validate(course_data)

    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

def add_course_member(db: Session, course_id: int, user_id: int):
    new_member = CourseMember(course_id=course_id, user_id=user_id)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

def get_content_detail_by_id(db: Session, course_id: int, content_id: int):
    content = db.query(CourseContent).filter(
        CourseContent.course_id == course_id,
        CourseContent.content_id == content_id
    ).first()
    return content
