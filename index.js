const express=require('express');
const app=express();
const cors=require('cors');
const dbConnect = require('./dbConnect');
const bodyParser = require('body-parser');
const {getCertificates,uploadToDrive}=require('./controllers/certificateController');
require('dotenv').config();
app.use(cors());
app.use(cors({
    origin: 'https://certificate-generator-frontend-psi.vercel.app'
  }));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));   

dbConnect();

app.get('/get-certificates',getCertificates);
app.post('/upload-to-drive',uploadToDrive);



app.listen(process.env.PORT,()=>{
    console.log('Server is running on port 5000');
})


