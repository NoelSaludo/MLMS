from sqlalchemy import Column, Integer, String
from database.base import Base

class User(Base):
    __tablename__ = 'UserAccount'

    UserID = Column(Integer, primary_key=True)
    FullName = Column(String, nullable=False)
    Email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    Role = Column(String, nullable=False)

    def __repr__(self):
        return f"<User(UserID={self.UserID}, Fullname='{self.Fullname}', Email='{self.Email}', Role='{self.Role}')>"
