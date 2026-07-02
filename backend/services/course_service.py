from sqlalchemy.orm import Session
from model.course import Course
from model.user import User
from model.course_member import CourseMember

def get_users_courses(db: Session, user_id: int):
    courses = db.query(Course).filter(
        Course.CourseID.in_(
            db.query(CourseMember.CourseID).filter(CourseMember.UserID == user_id)
            )).all()
    return courses
