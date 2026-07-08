from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String, Date


class Course(SQLModel, table=True):
    __tablename__ = 'course'

    course_id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(sa_column=Column(String, nullable=False))
    description: Optional[str] = Field(default=None, sa_column=Column(String, nullable=True))
    syllabus_file_path: Optional[str] = Field(default=None, sa_column=Column(String, nullable=True))
    start_date: date = Field(sa_column=Column(Date, nullable=False))
    end_date: date = Field(sa_column=Column(Date, nullable=False))
    status: str = Field(sa_column=Column(String, nullable=False))

    def __repr__(self):
        return f"<Course(course_id={self.course_id}, title='{self.title}', description='{self.description}', start_date='{self.start_date}', end_date='{self.end_date}', status='{self.status}')>"
