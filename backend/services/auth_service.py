from datetime import datetime, timedelta
from fastapi.params import Depends
from fastapi import Depends
from sqlmodel import Session
from database.dependency import get_db
from config import settings
import jwt

def create_jwt(data: dict, expires_delta: timedelta = None):
    expires = datetime.now() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode = data.copy()
    to_encode.update({"exp": expires})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_jwt(data: dict, expires_delta: timedelta = None):
    expires = datetime.now() + (expires_delta if expires_delta else timedelta(days=7))
    to_encode = data.copy()
    to_encode.update({"exp": expires})
    encoded_jwt = jwt.encode(to_encode, settings.REFRESH_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

def save_refresh_token(user_id: int, rt: str, db: Session = Depends(get_db)):
    from model.session import SessionModel
    existing_session = db.query(SessionModel).filter(SessionModel.user_id == user_id).first()
    if existing_session:
        # update the existing session with the new refresh token
        existing_session.refresh_token = rt
        db.commit()
    else:
        # save the refresh token in the database
        db.add(SessionModel(user_id=user_id, refresh_token=rt))
        db.commit()