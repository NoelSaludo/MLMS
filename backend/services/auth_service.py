from datetime import datetime, timedelta
from os import getenv
from jwt import encode
from config import settings

def create_access_token(data: dict, expires_delta: timedelta = None):
    expires = datetime.now() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode = data.copy()
    to_encode.update({"exp": expires})
    encoded_jwt = encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
