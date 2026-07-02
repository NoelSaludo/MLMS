from sqlalchemy.orm import Session
from model.user import User
import bcrypt

def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.Email == email).first()
    password_bytes = password.encode('utf-8')

    if user is None:
        return None
    if not bcrypt.checkpw(password_bytes, user.password.encode('utf-8')):
        return None
    else:
        return user