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