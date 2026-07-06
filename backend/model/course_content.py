from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Integer, String, ForeignKey, Date


class CourseContent(SQLModel, table=True):
    __tablename__ = 'CourseContent'

    ContentID: Optional[int] = Field(default=None, primary_key=True)
    CourseID: int = Field(sa_column=Column(Integer, ForeignKey('Course.CourseID'), nullable=False))
    Title: str = Field(sa_column=Column(String, nullable=False))
    Description: Optional[str] = Field(default=None, sa_column=Column(String, nullable=True))
    Type: str = Field(sa_column=Column(String, nullable=False))  # e.g., 'announcement', 'material', 'assignment'
    FilepathAttachment: Optional[str] = Field(default=None, sa_column=Column(String, nullable=True))  # URL to the content if applicable
    Score: Optional[int] = Field(default=None, sa_column=Column(Integer, nullable=True))  # Score for quizzes or assessments
    DueDate: Optional[date] = Field(default=None, sa_column=Column(Date, nullable=True))  # Due date for assignments or quizzes

    def __repr__(self):
        return f"<CourseContent(ContentID={self.ContentID}, CourseID={self.CourseID}, Title='{self.Title}', Type='{self.Type}')>"