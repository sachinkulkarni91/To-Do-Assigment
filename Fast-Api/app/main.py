from fastapi import FastAPI, HTTPException, Header
from app.models import TodoItem
from app.firebase import verify_firebase_token, db  # Ensure 'db' is correctly imported
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()



origins = [
    "http://localhost:3000", 
    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/todos/")
async def create_todo(todo: TodoItem, authorization: str = Header(...)):
    try:
        
        token = authorization.split(" ")[1]
        
        
        user = verify_firebase_token(token)
        due_date_str = todo.due_date.isoformat()
        db.collection("todos").add({
            "title": todo.title,
            "details": todo.details,
            "due_date": due_date_str,
            "user_id": user["uid"]
        })

    
        return {"status": "success", "data": todo, "user": user["uid"]}
    
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.delete("/todos/{todo_id}")
async def delete_todo(todo_id: str, authorization: str = Header(...)):
    try:
        
        token = authorization.split(" ")[1]
        
       
        user = verify_firebase_token(token)

        
        todo_ref = db.collection("todos").document(todo_id)
        todo = todo_ref.get()
        if not todo.exists:
            raise HTTPException(status_code=404, detail="Todo item not found")

        
        todo_ref.delete()

        return {"status": "success", "message": f"Todo item with ID {todo_id} has been deleted"}

    except Exception as e:
        
        if isinstance(e, HTTPException):
            raise e
        else:
            raise HTTPException(status_code=401, detail="Unauthorized or Invalid token")

@app.put("/todos/{todo_id}")
async def update_todo(todo_id: str, todo: TodoItem, authorization: str = Header(...)):
    try:
       
        token = authorization.split(" ")[1]
        
        
        user = verify_firebase_token(token)

        due_date_str = todo.due_date.isoformat()
        todo_ref = db.collection("todos").document(todo_id)
        existing_todo = todo_ref.get()
        if not existing_todo.exists:
            raise HTTPException(status_code=404, detail="Todo item not found")

        todo_ref.update({
            "title": todo.title,
            "details": todo.details,
            "due_date": due_date_str,
        })

        return {"status": "success", "message": f"Todo item with ID {todo_id} has been updated"}

    except Exception as e:
        
        if isinstance(e, HTTPException):
            raise e
        else:
            raise HTTPException(status_code=401, detail="Unauthorized or Invalid token")
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
