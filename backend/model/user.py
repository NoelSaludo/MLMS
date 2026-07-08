from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String


class User(SQLModel, table=True):
    __tablename__ = 'user_account'

    user_id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str = Field(sa_column=Column(String, nullable=False))
    email: str = Field(sa_column=Column(String, nullable=False, unique=True))
    password: str = Field(sa_column=Column(String, nullable=False))
    role: str = Field(sa_column=Column(String, nullable=False))

    def __repr__(self):
        return f"<User(user_id={self.user_id}, full_name='{self.full_name}', email='{self.email}', role='{self.role}')>"
