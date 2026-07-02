from sqlalchemy import Column, Integer
from database.base import Base

class CourseMember(Base):
    __tablename__ = 'CourseMember'

    MemberID = Column(Integer, primary_key=True)
    CourseID = Column(Integer, nullable=False)
    UserID = Column(Integer, nullable=False)