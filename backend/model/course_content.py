from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Integer, String, ForeignKey, Date


class CourseContent(SQLModel, table=True):
    __tablename__ = 'course_content'

    content_id: Optional[int] = Field(default=None, primary_key=True)
    course_id: int = Field(sa_column=Column(Integer, ForeignKey('course.course_id'), nullable=False))
    title: str = Field(sa_column=Column(String, nullable=False))
    description: Optional[str] = Field(default=None, sa_column=Column(String, nullable=True))
    type: str = Field(sa_column=Column(String, nullable=False))  # e.g., 'announcement', 'material', 'assignment'
    filepath_attachment: Optional[str] = Field(default=None, sa_column=Column(String, nullable=True))  # URL to the content if applicable
    score: Optional[int] = Field(default=None, sa_column=Column(Integer, nullable=True))  # Score for quizzes or assessments
    due_date: Optional[date] = Field(default=None, sa_column=Column(Date, nullable=True))  # Due date for assignments or quizzes

    def __repr__(self):
        return f"<CourseContent(content_id={self.content_id}, course_id={self.course_id}, title='{self.title}', type='{self.type}')>"
