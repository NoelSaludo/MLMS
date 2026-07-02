from sqlalchemy import Column, Date, Integer, String
from database.base import Base

class Course(Base):
    __tablename__ = 'Course'

    CourseID = Column(Integer, primary_key=True)
    Title = Column(String, nullable=False)
    Description = Column(String, nullable=True)
    StartDate = Column(Date, nullable=False)
    EndDate = Column(Date, nullable=False)
    Status = Column(String, nullable=False)


    def __repr__(self):
        return f"<Course(CourseID={self.CourseID}, Title='{self.Title}', Description='{self.Description}', StartDate='{self.StartDate}', EndDate='{self.EndDate}', Status='{self.Status}')>"