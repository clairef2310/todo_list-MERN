const { Signup, Login  } = require("../controllers/AuthController");
const router = require("express").Router();
const { userVerification } = require("../middlewares/AuthMiddleware")
const TodoModel = require("../models/todoList")
const cache = require("memory-cache");

router.post('/',userVerification)
router.post("/signup", Signup);
router.post('/login', Login)

// Get saved tasks from the database 
router.get("/getTodoList", async (req, res) => { 
	const cachedData = cache.get("todoList");
	if (cachedData) {
		// Si des données sont en cache, les renvoyer directement
		return res.json(cachedData);
	  }
	
	  try {
		// Si aucune donnée n'est mise en cache, récupérer les données depuis la base de données
		const todoList = await TodoModel.find({});
	
		// Mettre en cache les données avec une expiration de 1 heure (en millisecondes)
		cache.put("todoList", todoList, 3600000);
	
		// Renvoyer les données au client
		res.json(todoList);
	  } catch (error) {
		res.status(500).json({ message: "Erreur lors de la récupération des données." });
	  }
}); 

// Add new task to the database 
router.post("/addTodoList", (req, res) => { 
	TodoModel.create({ 
		task: req.body.task, 
		status: req.body.status, 
		deadline: req.body.deadline, 
	}) 
		.then((todo) => res.json(todo)) 
		.catch((err) => res.json(err)); 
}); 

// Update task fields (including deadline) 
router.post("/updateTodoList/:id", (req, res) => { 
	const id = req.params.id; 
	const updateData = { 
		task: req.body.task, 
		status: req.body.status, 
		deadline: req.body.deadline, 
	}; 
	TodoModel.findByIdAndUpdate(id, updateData) 
		.then((todo) => res.json(todo)) 
		.catch((err) => res.json(err)); 
}); 

// Delete task from the database 
router.delete("/deleteTodoList/:id", (req, res) => { 
	const id = req.params.id; 
	TodoModel.findByIdAndDelete({ _id: id }) 
		.then((todo) => res.json(todo)) 
		.catch((err) => res.json(err)); 
}); 



module.exports = router;