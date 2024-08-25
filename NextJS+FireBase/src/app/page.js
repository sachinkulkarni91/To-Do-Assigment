'use client'

import PrivateRoute from "@/component/PrivateRoute";
import {db} from '../config'
import { collection,addDoc,getDocs,deleteDoc,serverTimestamp,query,orderBy,doc,updateDoc } from "firebase/firestore";
import React,{useState,useEffect} from "react";
import {toast} from 'react-hot-toast'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "../config";

 
  


  async function addTodo(title,details,dueDate){
    try {
       
        const user = auth.currentUser;
    
        if (user) {
          const token = await user.getIdToken();
    
          const response = await fetch("https://to-do-assigment-c5vd-e1xj4tnod-sachinkulkarni91s-projects.vercel.app/todos/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, details, due_date: dueDate }),
          });
    
          const data = await response.json();
          console.log(data);
          return true
        } else {
          console.log("User is not authenticated");
        }
      
    } catch (error) {
      console.log("Error adding todo:",error);
      return false;
    }
  }

async function fetchTodo(){
  const todosCollection = collection(db,"todos")
  const querySnapshot = await getDocs(collection(db, "todos"));
  const todos = [];
  querySnapshot.forEach((doc)=>{
    const todoData = doc.data();
    todos.push({id:doc.id,...todoData})
  })
  return todos;
}






async function deleteTodo(todoId){
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User is not authenticated");
      }
  
      const token = await user.getIdToken();
  
      const response = await fetch(`http://localhost:8000/todos/${todoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete todo with status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Delete successful:", result);
      return result,true;
    } catch (error) {
      console.error("Error deleting todo:", error);
      return null;
    }
  
}
export async function updateToDo(todoId, updatedTodo) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch(`http://localhost:8000/todos/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  
      },
      body: JSON.stringify(updatedTodo),  
    });

    if (!response.ok) {
      throw new Error(`Failed to update todo with status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Update successful:", result);
    return result;
  } catch (error) {
    console.error("Error updating todo:", error);
    return null;
  }
}
export default function Home() {
  const { user, logout } = useAuthContext();
  const router = useRouter();

  const [title,setTitle] = useState("");
  const [details,setDetails] = useState("");
  const [dueDate,setDueDate] = useState("");
  const [todos,setTodos] = useState([]);
  const [selectedTodo,setSelectedTodo]=useState(null);
  const [isUpdateMode,setIsUpdateMode] = useState(false);

  const handleSubmit = async(e)=>{
    e.preventDefault(); 
    if(isUpdateMode){
      if(selectedTodo){
        try {
          const updateTodo = {
            title,
            details,
            due_date: dueDate 
          }
          
          const result = await updateToDo(selectedTodo.id, updateTodo);
          setTodos(todos.map(todo => (todo.id === selectedTodo.id ? { ...todo, ...updateTodo } : todo)));

          if (result) {
            setTodos(todos.map(todo => (todo.id === selectedTodo.id ? { ...todo, ...updatedTodo } : todo)));
            setTitle("");
            setDetails("");
            setDueDate("");
            setSelectedTodo(null);
            setIsUpdateMode(false);
            toast.success("Todo updated successfully!");
        } else {
            toast.error("Failed to update todo.");
        }


        } catch (error) {
          console.error("Error updating todo :",error)
        }
      }
    }
    else{
      const added = await addTodo(title,details,dueDate);
      if(added){
        const updatedTodos = await fetchTodo();
      setTodos(updatedTodos);

        setTitle("");
        setDetails("");
        setDueDate("");
        toast.success("Todo added successfully !")
        
      }
    }
  }

  useEffect(()=>{
    async function fetchTodos(){
      const todos = await fetchTodo();
      setTodos(todos);
    }
    fetchTodos();
  },[])


  const handleUpdateClick = (todo)=>{
    setTitle(todo.title || "");
    setDetails(todo.details || "");
    setDueDate(todo.dueDate || "");

    setSelectedTodo(todo);
    setIsUpdateMode(true);
  }


  useEffect(()=>{
    async function fetchTodos(){
      const todos = await fetchTodo();
      setTodos(todos);
    }
    fetchTodos();
  },[])

  const handleDelete = async (todo) => {
    const result = await deleteTodo(todo.id);
    if (result) {
        const updatedTodos = todos.filter((t) => t.id !== todo.id);
        setTodos(updatedTodos);
        toast.success("Todo deleted successfully!");
    } else {
        toast.error("Failed to delete todo.");
    }
};

  const handleLogout = async () => {
    try {
        await logout();
        router.push("/");
    } catch (error) {
        console.log(error);
    }
};


  return (
    <PrivateRoute>
    <main className="flex flex-1 items-center justify-center flex-col md:flex-row min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
    <button
          className="absolute top-4 right-4 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={handleLogout}
        >
          Logout
        </button>
      <section className="flex-1 flex md:flex-col items-center md:justify-start mx-auto">
        <div className="p-6 md:p-12 mt-10 rounded-lg shadow-2xl w-full max-w-lg bg-white">
          <h2 className="text-center text-3xl font-bold leading-9 text-gray-900 mb-6">
            {isUpdateMode ? "Update Your Todo" : "Create a Todo"}
            
          </h2>
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-base font-medium leading-6 text-gray-700">
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  type="text"
                  autoComplete="off"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 pl-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
  
            <div>
              <label htmlFor="details" className="block text-base font-medium leading-6 text-gray-700">
                Details
              </label>
              <div className="mt-2">
                <textarea
                  id="details"
                  name="details"
                  rows="4"
                  autoComplete="off"
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 pl-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-base font-medium leading-6 text-gray-700">
                Due Date
              </label>
              <div className="mt-2">
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  autoComplete="off"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 pl-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isUpdateMode ? "Update Todo" : "Create Todo"}
              </button>
            </div>
          </form>
        </div>
      </section>
  
      <section className="md:w-1/2 md:max-h-screen overflow-y-auto md:ml-20 mx-auto">
        <div className="p-6 md:p-12 mt-10 rounded-lg shadow-2xl w-full max-w-lg bg-white">
          <h2 className="text-center text-3xl font-bold leading-9 text-gray-900 mb-6">
            Todo List
          </h2>
          <div className="mt-6 space-y-6">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="border border-gray-300 rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 break-words">
                  {todo.title}
                </h3>
                <p className="text-base text-gray-600 mt-2">
                  Due Date: {todo.due_date}
                </p>
                <p className="text-gray-700 multiline break-words mt-4">
                  {todo.details}
                </p>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-base font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => handleUpdateClick(todo)}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-base font-semibold text-white bg-red-500 hover:bg-red-700 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => handleDelete(todo)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  </PrivateRoute>
  );
}
