from sqlalchemy.orm import Session
from model.course import Course
from model.user import User
from model.course_member import CourseMember
from model.course_content import CourseContent

def get_courses_members(db: Session, user_id: int):
    courses = db.query(Course).filter(
        Course.CourseID.in_(
            db.query(CourseMember.CourseID).filter(CourseMember.UserID == user_id)
            )).all()
    return courses

def get_course_by_id(db: Session, course_id: int):
    course = db.query(Course).filter(Course.CourseID == course_id).first()
    return course

def get_course_contents(db: Session, course_id: int):
    course_contents = db.query(CourseContent).filter(
        CourseContent.CourseID == course_id).all()
    return course_contents

def get_course_materials_by_id(db: Session, course_id: int):
    course_materials = db.query(CourseContent).filter(
        CourseContent.CourseID == course_id,
        CourseContent.Type == 'material'
    ).all()
    return course_materials

def get_course_members(db: Session, course_id: int):
    members = db.query(User).select_from(CourseMember).join(User, CourseMember.UserID == User.UserID).filter(
        CourseMember.CourseID == course_id
    ).all()
    return members

def create_course_content(db: Session, course_id: int, content_data):
    if hasattr(content_data, "model_dump"):
        content_data = content_data.model_dump()
    elif hasattr(content_data, "dict"):
        content_data = content_data.dict()

    new_content = CourseContent(
        CourseID=course_id,
        Title=content_data.get('title'),
        Description=content_data.get('description'),
        Type=content_data.get('type'),
        FilepathAttachment=content_data.get('filepathAttachment'),
        Score=content_data.get('score'),
        DueDate=content_data.get('dueDate')
    )
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    return new_content

def create_course(db: Session, course_data):
    if hasattr(course_data, "model_dump"):
        course_data = course_data.model_dump()
    elif hasattr(course_data, "dict"):
        course_data = course_data.dict()

    new_course = Course(
        Title=course_data.get('title'),
        Description=course_data.get('description'),
        SyllabusFilePath=course_data.get('fileattachment'),
        StartDate=course_data.get('startDate'),
        EndDate=course_data.get('endDate'),
        Status=course_data.get('status')
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

def add_course_member(db: Session, course_id: int, user_id: int):
    new_member = CourseMember(CourseID=course_id, UserID=user_id)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member