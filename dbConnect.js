const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect= async()=>{
  try{
    const connection= await mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
    })
    console.log('Connecter to database');
  }
  catch(error){
    console.log('Error connecting to database:',error);
  }
}
module.exports=dbConnect;
