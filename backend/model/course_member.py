from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Integer


class CourseMember(SQLModel, table=True):
    __tablename__ = 'CourseMember'

    MemberID: Optional[int] = Field(default=None, primary_key=True)
    CourseID: int = Field(sa_column=Column(Integer, nullable=False))
    UserID: int = Field(sa_column=Column(Integer, nullable=False))