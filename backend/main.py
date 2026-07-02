from fastapi import FastAPI
from api import course, health, user

app = FastAPI()

app.include_router(health.router)
app.include_router(user.router)
app.include_router(course.router)