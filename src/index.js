import express from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";
import { registerUser } from './controllers/users.js';
import { loginUser } from './controllers/auth.js';
import { createEvent, fetchSingleEvent } from './controllers/events.js';
import verifyToken  from './middleware/verifyToken.js';
import  validateEvent  from './middleware/validateEvent.js';
//
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin:["http://localhost:5173"],
    methods:["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,

}))

app.use(cookieParser());


//routes
app.post("/users", registerUser); 

app.post("/auth/login", loginUser);

app.post("/events", verifyToken, validateEvent, createEvent); 

app.get("/events/:id", verifyToken, fetchSingleEvent); //fetch single note (http://localhost:1929/notes"))
//server
app.listen(1929, () => console.log('Server running on port 1929...'));