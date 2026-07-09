from sqlmodel import SQLModel, Field

class SessionModel(SQLModel, table=True):
    __tablename__ = "session"

    session_id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user_account.user_id")
    refresh_token: str = Field(sa_column_kwargs={"nullable": False})