import React from "react"; 
import CustomAxios from '../interceptor';
import { useEffect, useState, useLocation } from "react"; 
import { Button, Col, Container, Row,Table } from "react-bootstrap";
import { Form } from "react-router-dom";

function Todo() { 
	const [todoList, setTodoList] = useState([]); 
	const [editableId, setEditableId] = useState(null); 
	const [editedTask, setEditedTask] = useState(""); 
	const [editedStatus, setEditedStatus] = useState(""); 
	const [newTask, setNewTask] = useState(""); 
	const [newStatus, setNewStatus] = useState(""); 
	const [newDeadline, setNewDeadline] = useState(""); 
	const [editedDeadline, setEditedDeadline] = useState(""); 

	const location = useLocation();

	//Récupération des todolist créer
	useEffect(() => { 
		CustomAxios.get('process.env.REACT_APP_PATH_GET_TODO') 
			.then(result => { 
				setTodoList(result.data) 
			}) 
			.catch(err => console.log(err)) 
	}, []) 

	//Function to toggle the editable state for a specific row 
	const toggleEditable = (id) => { 
		const rowData = todoList.find((data) => data._id === id); 
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


	//Fonction d'ajout d'un tâche 
	const addTask = (e) => { 
		e.preventDefault(); 
		if (!newTask || !newStatus || !newDeadline) { 
			alert("All fields must be filled out."); 
			return; 
		} 

		CustomAxios.post(process.env.REACT_APP_PATH_ADD_TODO, { task: newTask, status: newStatus, deadline: newDeadline }) 
			.then(res => { 
				console.log(res); 
				location.reload();
			}) 
			.catch(err => console.log(err)); 
	} 

	//Fonction de savegarde de la tâche créer
	const saveEditedTask = (id) => { 
		const editedData = { 
			task: editedTask, 
			status: editedStatus, 
			deadline: editedDeadline, 
		}; 

		//Erreur retourné si tous les champs ne sont pas rempli
		if (!editedTask || !editedStatus || !editedDeadline) { 
			alert("All fields must be filled out."); 
			return; 
		} 

		//Mise à jour des données d'un tâche déjà créée
		CustomAxios.post(process.env.REACT_APP_PATH_UPDATE_TODO + id, editedData) 
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


	//Suppression d'une tâche
	const deleteTask = (id) => { 
		CustomAxios.delete(process.env.REACT_APP_PATH_DELETE_TODO + id) 
			.then(result => { 
				console.log(result); 
				window.location.reload(); 
			}) 
			.catch(err => 
				console.log(err) 
			) 
	} 

	return ( 
		<Container className="mt-5"> 
			<Row> 
				<Col className="col-md-7"> 
					<h2 className="text-center">Todo List</h2> 
						<Table striped bordered hover responsive> 
							<thead> 
								<tr> 
									<th>Tâches</th> 
									<th>Status</th> 
									<th>Deadline</th> 
									<th>Actions</th> 
								</tr> 
							</thead> 
							{Array.isArray(todoList) ? ( 
								<tbody> 
									{todoList.map((data) => ( 
										<tr key={data._id}> 
											<td> 
												{editableId === data._id ? ( 
													<Form.Group 
														type="text"
														value={editedTask} 
														onChange={(e) => setEditedTask(e.target.value)} 
													/> 
												) : ( 
													data.task 
												)} 
											</td> 
											<td> 
												{editableId === data._id ? ( 
													<Form.Group 
														type="text"
														value={editedStatus} 
														onChange={(e) => setEditedStatus(e.target.value)} 
													/> 
												) : ( 
													data.status 
												)} 
											</td> 
											<td> 
												{editableId === data._id ? ( 
													<Form.Group 
														type="datetime-local"
														value={editedDeadline} 
														onChange={(e) => setEditedDeadline(e.target.value)} 
													/> 
												) : ( 
													data.deadline ? new Date(data.deadline).toLocaleString() : ''
												)} 
											</td> 

											<td> 
												{editableId === data._id ? ( 
													<Button className="btn btnPrimary btn-sm" onClick={() => saveEditedTask(data._id)}> 
														Enregistrer 
													</Button> 
												) : ( 
													<Button className="btn btn-sm btnPrimary" onClick={() => toggleEditable(data._id)}> 
														Editer
													</Button> 
												)} 
												<Button className="btn btn-sm ms-4 btnSecondary" onClick={() => deleteTask(data._id)}> 
													Supprimer 
												</Button> 
											</td> 
										</tr> 
									))} 
								</tbody> 
							) : ( 
								<tbody> 
									<tr> 
										<td colSpan="4">Chargement...</td> 
									</tr> 
								</tbody> 
							)} 


						</Table> 
				</Col> 
				<Col className="col-md-5"> 
					<h2 className="text-center">Ajouter une tâche</h2> 
					<Form className="bg-light p-4 rounded-2"> 
						<Form.Group className="mb-3"> 
							<Form.Label>Tâche</Form.Label> 
							<Form.Control 
								type="text"
								placeholder="Saisir la tâche"
								onChange={(e) => setNewTask(e.target.value)} 
							/> 
						</Form.Group> 
						<Form.Group className="mb-3"> 
							<Form.Label>Status</Form.Label> 
							<Form.Control 
								type="text"
								placeholder="Entrer le statut"
								onChange={(e) => setNewStatus(e.target.value)} 
							/> 
						</Form.Group> 
						<Form.Group className="mb-3"> 
							<Form.Label>Deadline</Form.Label> 
							<Form.Control 
								type="datetime-local"
								onChange={(e) => setNewDeadline(e.target.value)} 
							/> 
						</Form.Group> 
						<Button onClick={addTask} className="btn btnPrimary btn-sm"> 
							Ajouter
						</Button> 
					</Form> 
				</Col> 

			</Row> 
		</Container> 
	) 
} 
export default Todo;
