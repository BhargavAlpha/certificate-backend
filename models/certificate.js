const mongoose=require('mongoose');
const certificate=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    }
    }
)
module.exports=mongoose.model('certificate',certificate);