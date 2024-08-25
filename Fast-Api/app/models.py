from pydantic import BaseModel
from datetime import date

class TodoItem(BaseModel):
    title: str
    details: str
    due_date: date
