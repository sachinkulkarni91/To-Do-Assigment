This is a backend application for a Todo management system built with FastAPI. The backend provides RESTful API endpoints to create, update, and delete (CRUD) todo items, with Firebase authentication integrated for secure access.


Table of Contents

Installation
Setup
Running the Application
API Endpoints
Firebase Integration
Environment Variables
License
Installation
To get started with the FastAPI backend, you need to set up your development environment.

Prerequisites
Virtual environment tool (venv or virtualenv)
Firebase account and Firebase Admin SDK JSON credentials
Clone the Repository

git clone https://github.com/yourusername/fastapi-todo.git
cd fastapi-todo
Create and Activate Virtual Environment
On macOS and Linux:



On Windows:
python -m venv venv
venv\Scripts\activate
Install Dependencies
Install all necessary Python packages using pip:


pip install -r requirements.txt
Setup
Configure Firebase Credentials
Go to the Firebase console and navigate to the Service Accounts section.
Generate a new private key and download the JSON credentials file.
Save this file in your project directory as firebase_credentials.json.



FIREBASE_CREDENTIALS_PATH=firebase_credentials.json
Make sure to replace the path with the location of your Firebase credentials file that you dowload

Running the Application
To run the FastAPI application locally, execute the following command:



uvicorn app.main:app --reload
This command will start the development server on http://127.0.0.1:8000. The --reload flag enables auto-reloading of the server when code changes are detected.

API Endpoints
1. Create Todo
Endpoint: /todos/
Method: POST
Description: Creates a new todo item.
Request Body:
{
  "title": "Todo Title",
  "details": "Details of the todo",
  "due_date": "YYYY-MM-DD"
}
Response:

{
  "status": "success",
  "data": {
    "id": "todo_id",
    "title": "Todo Title",
    "details": "Details of the todo",
    "due_date": "YYYY-MM-DD"
  }
}
2. Get Todos
Endpoint: /todos/
Method: GET
Description: Retrieves all todo items.
Response:
[
  {
    "id": "todo_id",
    "title": "Todo Title",
    "details": "Details of the todo",
    "due_date": "YYYY-MM-DD"
  },
  ...
]
3. Update Todo
Endpoint: /todos/{todo_id}
Method: PUT
Description: Updates a specific todo item by ID.
Request Body:
{
  "title": "Updated Todo Title",
  "details": "Updated details of the todo",
  "due_date": "YYYY-MM-DD"
}
Response:
{
  "status": "success",
  "message": "Todo item with ID {todo_id} has been updated"
}
4. Delete Todo
Endpoint: /todos/{todo_id}
Method: DELETE
Description: Deletes a specific todo item by ID.
Response:
{
  "status": "success",
  "message": "Todo item with ID {todo_id} has been deleted"
}
Firebase Integration
This application integrates Firebase for authentication. To make API requests, clients must include a valid Firebase ID token in the Authorization header:


Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
Environment Variables
The application uses environment variables for configuration. Ensure you have the following variables set in your .env file:

FIREBASE_CREDENTIALS_PATH: Path to your Firebase credentials JSON file.
