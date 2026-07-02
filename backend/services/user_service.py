from sqlalchemy.orm import Session
from model.user import User
import bcrypt

def get_user(db: Session, email: str):
    return db.query(User).filter(User.Email == email).first()