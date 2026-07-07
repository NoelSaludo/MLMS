from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String, Date


class Course(SQLModel, table=True):
    __tablename__ = 'Course'

    CourseID: Optional[int] = Field(default=None, primary_key=True)
    Title: str = Field(sa_column=Column(String, nullable=False))
    Description: Optional[str] = Field(default=None, sa_column=Column(String, nullable=True))
    SyllabusFilePath: Optional[str] = Field(default=None, sa_column=Column(String, nullable=True))
    StartDate: date = Field(sa_column=Column(Date, nullable=False))
    EndDate: date = Field(sa_column=Column(Date, nullable=False))
    Status: str = Field(sa_column=Column(String, nullable=False))

    def __repr__(self):
        return f"<Course(CourseID={self.CourseID}, Title='{self.Title}', Description='{self.Description}', StartDate='{self.StartDate}', EndDate='{self.EndDate}', Status='{self.Status}')>"