from fastapi import FastAPI
from api import course, health, login

app = FastAPI()

app.include_router(health.router)
app.include_router(login.router)
app.include_router(course.router)