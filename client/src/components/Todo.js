import axios from "axios"; 
import React from "react"; 
import { useEffect, useState, useMemo } from "react"; 
import { Container, Table, Form, Button, Row, Col } from "react-bootstrap";

function Todo() { 
	const [editableId, setEditableId] = useState(null); 
	const [editedTask, setEditedTask] = useState(""); 
	const [editedStatus, setEditedStatus] = useState(""); 
	const [newTask, setNewTask] = useState(""); 
	const [newStatus, setNewStatus] = useState(""); 
	const [newDeadline, setNewDeadline] = useState(""); 
	const [editedDeadline, setEditedDeadline] = useState(""); 
	const [cachedTodoList, setCachedTodoList] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
		  try {
			const result = await axios.get('http://127.0.0.1:3001/getTodoList');
			setCachedTodoList(result.data);
		  } catch (error) {
			console.log(error);
		  }
		};
	
		if (!cachedTodoList) {
		  fetchData();
		}
	}, [cachedTodoList]);
	

	const todoList = useMemo(() => cachedTodoList || [], [cachedTodoList]);
 	const memoizedTodoList = useMemo(() => todoList, [todoList]);

	// Function to toggle the editable state for a specific row 
	const toggleEditable = (id) => { 
		const rowData = memoizedTodoList.find((data) => data._id === id); 
		if (rowData) { 
			setEditableId(id); 
			setEditedTask(rowData.task); 
			setEditedStatus(rowData.status); 
			setEditedDeadline(rowData.deadline || ""); 
		} else { 
			setEditableId(null); 
			setEditedTask(""); 
			setEditedStatus(""); 
			setEditedDeadline(""); 
		} 
	}; 


	// Function to add task to the database 
	const addTask = (e) => { 
		e.preventDefault(); 
		if (!newTask || !newStatus || !newDeadline) { 
			alert("All fields must be filled out."); 
			return; 
		} 

		axios.post('http://127.0.0.1:3001/addTodoList', { task: newTask, status: newStatus, deadline: newDeadline }) 
			.then(res => { 
				console.log(res); 
				window.location.reload(); 
			}) 
			.catch(err => console.log(err)); 
	} 

	// Function to save edited data to the database 
	const saveEditedTask = (id) => { 
		const editedData = { 
			task: editedTask, 
			status: editedStatus, 
			deadline: editedDeadline, 
		}; 

		// If the fields are empty 
		if (!editedTask || !editedStatus || !editedDeadline) { 
			alert("All fields must be filled out."); 
			return; 
		} 

		// Updating edited data to the database through updateById API 
		axios.post('http://127.0.0.1:3001/updateTodoList/' + id, editedData) 
			.then(result => { 
				console.log(result); 
				setEditableId(null); 
				setEditedTask(""); 
				setEditedStatus(""); 
				setEditedDeadline(""); // Clear the edited deadline 
				window.location.reload(); 
			}) 
			.catch(err => console.log(err)); 
	} 


	// Delete task from database 
	const deleteTask = (id) => { 
		axios.delete('http://127.0.0.1:3001/deleteTodoList/' + id) 
			.then(result => { 
				console.log(result); 
				window.location.reload(); 
			}) 
			.catch(err => 
				console.log(err) 
			) 
	} 

	return ( 
		<Container>
			<Row>
				<Col>
				<h2 className="text-center">Todo List</h2> 
					<Table striped bordered hover> 
						<thead> 
							<tr> 
								<th>Tache</th> 
								<th>Status</th> 
								<th>Deadline</th> 
								<th>Actions</th> 
							</tr> 
						</thead> 
						{Array.isArray(memoizedTodoList) ? ( 
							<tbody> 
								{memoizedTodoList.map((data) => ( 
									<tr key={data._id}> 
										<td> 
											{editableId === data._id ? ( 
												<input 
													type="text"
													value={editedTask} 
													onChange={(e) => setEditedTask(e.target.value)} 
													className="styleInput"
												/> 
											) : ( 
												data.task 
											)} 
										</td> 
										<td> 
											{editableId === data._id ? ( 
												<input 
													type="text"
													value={editedStatus} 
													onChange={(e) => setEditedStatus(e.target.value)} 
													className="styleInput"
												/> 
											) : ( 
												data.status 
											)} 
										</td> 
										<td> 
											{editableId === data._id ? ( 
												<input 
													type="datetime-local"
													value={editedDeadline} 
													onChange={(e) => setEditedDeadline(e.target.value)} 
													className="styleInput"
												/> 
											) : ( 
												data.deadline ? new Date(data.deadline).toLocaleString() : ''
											)} 
										</td> 
										<td> 
											{editableId === data._id ? ( 
												<Button className="btn me-1 mb-1" onClick={() => saveEditedTask(data._id)}> 
													Enregistrer 
												</Button> 
											) : ( 
												<Button className="btn me-1 mb-1" onClick={() => toggleEditable(data._id)}> 
													Editer 
												</Button> 
											)} 
											<Button className="btn me-1" onClick={() => deleteTask(data._id)}> 
												Supprimer 
											</Button> 
										</td> 
									</tr> 
								))} 
							</tbody> 
						) : ( 
							<tbody> 
								<tr> 
									<td colSpan="4">Chargement</td> 
								</tr> 
							</tbody> 
						)} 
					</Table>
				</Col>
				<Col>
					<h2 className="text-center">Ajouter une tache</h2> 
					<Form className="form_task"> 
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label className="formLabel">Tache</Form.Label>
							<Form.Control type="text" placeholder="Enter la tache" onChange={(e) => setNewTask(e.target.value)} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label className="formLabel">Statut</Form.Label>
							<Form.Control type="text" placeholder="Enter le statut" onChange={(e) => setNewStatus(e.target.value)} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label className="formLabel">Deadline</Form.Label>
							<Form.Control type="datetime-local" onChange={(e) => setNewDeadline(e.target.value)} />
						</Form.Group>
						<Button onClick={addTask} className="btn"> 
							Ajouter
						</Button> 
					</Form>
				</Col>
			</Row>
			 

			 
		</Container>
	) 
} 
export default Todo;
