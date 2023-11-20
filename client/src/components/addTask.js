import React from "react"; 
import { useState} from "react"; 
import axios from "axios";

function AddTask() { 

	const [newTask, setNewTask] = useState(""); 
	const [newStatus, setNewStatus] = useState(""); 
	const [newDeadline, setNewDeadline] = useState(""); 

      // Function to add task to the database 
      const addTask = (e) => { 
        e.preventDefault(); 
        if (!newTask || !newStatus || !newDeadline) { 
            alert("All fields must be filled out."); 
            return; 
        } 
  
        axios.post(process.env.REACT_APP_PATH_ADD_TODO, { task: newTask, status: newStatus, deadline: newDeadline }) 
            .then(res => { 
                console.log(res); 
                window.location.reload(); 
            }) 
            .catch(err => console.log(err)); 
    } 

	return ( 
        <div className="col-md-5"> 
        <h2 className="text-center">Add Task</h2> 
        <form className="bg-light p-4"> 
            <div className="mb-3"> 
                <label>Task</label> 
                <input 
                    className="form-control"
                    type="text"
                    placeholder="Enter Task"
                    onChange={(e) => setNewTask(e.target.value)} 
                /> 
            </div> 
            <div className="mb-3"> 
                <label>Status</label> 
                <input 
                    className="form-control"
                    type="text"
                    placeholder="Enter Status"
                    onChange={(e) => setNewStatus(e.target.value)} 
                /> 
            </div> 
            <div className="mb-3"> 
                <label>Deadline</label> 
                <input 
                    className="form-control"
                    type="datetime-local"
                    onChange={(e) => setNewDeadline(e.target.value)} 
                /> 
            </div> 
            <button onClick={addTask} className="btn btn-success btn-sm"> 
                Add Task 
            </button> 
        </form> 
    </div> 
	) 
} 
export default AddTask;
