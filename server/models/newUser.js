const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newUserSchema = new Schema(
    {   
        id_formu:{
            type: Number,
            require: true
        },
        nom:{
            type: String,
            required: true
        },
        prenom:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        pwd:{
            type: String,
            required: true
        },  
    }
)

module.exports = mongoose.model("newUser",newUserSchema);
