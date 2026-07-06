from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String


class User(SQLModel, table=True):
    __tablename__ = 'UserAccount'

    UserID: Optional[int] = Field(default=None, primary_key=True)
    FullName: str = Field(sa_column=Column(String, nullable=False))
    Email: str = Field(sa_column=Column(String, nullable=False, unique=True))
    password: str = Field(sa_column=Column(String, nullable=False))
    Role: str = Field(sa_column=Column(String, nullable=False))

    def __repr__(self):
        return f"<User(UserID={self.UserID}, FullName='{self.FullName}', Email='{self.Email}', Role='{self.Role}')>"
