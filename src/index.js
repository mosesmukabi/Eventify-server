import express from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";
import { registerUser, updatePersonalInfo } from './controllers/users.js';
import { loginUser } from './controllers/auth.js';
import { createEvent, fetchSingleEvent, fetchAllEvents, getUserEvents, deleteEvent, updateEvent, getUserProfile  } from './controllers/events.js';
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

app.get("/users/me", verifyToken, getUserProfile);


app.put("/users", verifyToken, updatePersonalInfo);

app.post("/auth/login", loginUser);

app.post("/events", verifyToken, validateEvent, createEvent);

app.get("/events/user", verifyToken, getUserEvents); 

app.get("/events/:id", verifyToken, fetchSingleEvent); //fetch single note by id

app.get("/events", verifyToken, fetchAllEvents);
app.delete("/events/:id", verifyToken, deleteEvent);

app.put("/events/:id", verifyToken, validateEvent, updateEvent);


//server
app.listen(1929, () => console.log('Server running on port 1929...'));