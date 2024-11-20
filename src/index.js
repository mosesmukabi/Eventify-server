import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcypt from 'bcryptjs';
import cors from 'cors'
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin:["http://localhost:5173"],
    methods:["GET", "POST", "PATCH", "PUT", "DELETE"]

}))

const client = new PrismaClient();

app.post("/users", async (req, res) => {
    try{
        const {firstName, lastName, email, password} = req.body;
        const hashedPassword = await bcypt.hash(password, 8);

        const user = await client.user.create({
            data: {
                firstName,  
                lastName,
                email,
                password : hashedPassword
            }
        })
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({message: "something went wrong..."})
    }
})

app.post("/auth/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await client.user.findUnique({
            where: {
                email: email
            }
        })

        if(!user){
            res.status(404).json({message: "wrong email or password!"});
            return;
        }

        const isPasswordValid = await bcypt.compare(password, user.password);
        if(!isPasswordValid){
            res.status(401).json({message: "wrong email or password!"});
            return;
        }
        const token = jwt.sign(user.id, process.env.JWT_SECRET)
        res.status(200).cookie("authToken", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }).json(user);
    } catch (error) {
        res.status(500).json({message: "something went wrong..."})
    }
})

app.listen(1929, () => console.log('Server running on port 1929...'));