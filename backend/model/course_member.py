from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Integer


class CourseMember(SQLModel, table=True):
    __tablename__ = 'course_member'

    member_id: Optional[int] = Field(default=None, primary_key=True)
    course_id: int = Field(sa_column=Column(Integer, nullable=False))
    user_id: int = Field(sa_column=Column(Integer, nullable=False))
