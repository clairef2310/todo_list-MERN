const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema(
    {   
        id_formu:{
            type: Number,
            require: true
        },
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
    }
)

module.exports = mongoose.model("todos",todoSchema);