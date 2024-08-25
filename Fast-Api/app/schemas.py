from pydantic import BaseModel

class TodoCreate(BaseModel):
    title: str
    details: str
    due_date: str
