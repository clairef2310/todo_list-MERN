const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt')
const {body,validationResult} = require ('express-validator')
require('dotenv').config()
const saltRounds = 10;
const router = express.Router()
const TodoModel = require("./models/todoList") 
const NewUserModel = require("./models/newUser")
const id_formulaire = require('./models/formId')


// ------------------------------------ TODOLIST -------------------------------

// Get saved tasks from the database 
router.get("/getTodoList", (req, res) => { 
	TodoModel.find({}) 
		.then((todoList) => res.json(todoList)) 
		.catch((err) => res.json(err)) 
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

// -------------------------------------- User ----------------

//route pour récupérer un utilisateur
router.get('/storedata/user',authenticateToken,async (req, res)=>{
    NewUserModel.findOne({id_formu: req.id},function(err,doc){
        if(err) return err
        res.json(doc)
    })
})

//permet d'obtenir le nom et prénom de n'importe quel utilisateur
router.get('/storedata/userinfo',authenticateToken,async (req, res)=>{
    NewUserModel.findOne({id_formu: req.query.id},{_id: 0,nom: 1,prenom: 1},function(err,doc){
        if(err) return err
        res.json(doc)
    })
})

//créer un utilisateur
router.post('/storedata/addUser:postformu',authenticateToken,
    body('pwd').blacklist('{}$').trim(),
    body("nomUT").trim().escape(),
    body("prenomUT").trim().escape(),
    body("email").isEmail().trim().normalizeEmail().whitelist( ['abcdefghijklmnopqrstuvwxyz','123456789','@','.','-','_'] ),
    async (req, res) => {
        if (!errors.isEmpty()) {
            return res.sendStatus(400)
        }else{
            
            const id = id_formulaire.findOne({name: 'newUser'},{id: 1,_id: 0})
            const hf = await id.exec()
            let it = JSON.stringify(hf.id)
            let password = req.body.pwd
            
            let pass = await bcrypt.hash(password, saltRounds)
            const new_form = new NewUserModel({
                id_formu: it ,
                nom: req.body.nomUT,
                prenom: req.body.prenomUT,
                email: req.body.email,
                pwd: pass,
            })
            new_form.save()
            .then(data =>{
                res.json(data)
                const query = id_formulaire.updateOne({name: "newUser"},{id: (hf.id+1)})
                query.exec()
            })
            .catch(err =>{
                res.json(err)
            })
        }       
    }
);

module.exports = router

//verification du token pour verifier si l'authentification est bonne
async function authenticateToken(req, res, next){
    const token = req.headers['x-access-token'];
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if (err){  
            return res.sendStatus(401)
        }
        req.id = user.id
        next()
    })
}