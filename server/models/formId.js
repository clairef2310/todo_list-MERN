const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const id_from = new Schema(
    {
        id:{
            type : Number,
            required : true
        },
        name:{
            type: String,
            required: true  
        }
    }
)

module.exports = mongoose.model("id_forms",id_from);