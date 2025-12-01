import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import {router} from './router/apiRoutes.js'
import createUser from './model/createUser.js';
import createChat from './model/createChat.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Below 2 module are databse table connection
await createUser();
await createChat();

// Routes will go to router folder
app.use('/',router); 

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});
