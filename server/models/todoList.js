const mongoose = require('mongoose'); 
const bcrypt = require("bcryptjs");

const todoSchema = new mongoose.Schema({ 
	task: { 
		type: String, 
		required: true, 
	}, 
	status: { 
		type: String, 
		required: true, 
	}, 
	deadline: { 
		type: Date, 
	}, 
}); 


module.exports = mongoose.model("todo", todoSchema); 
