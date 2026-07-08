from sqlalchemy.orm import Session
from model.user import User

def get_user(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()
