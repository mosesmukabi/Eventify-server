import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcypt from 'bcryptjs';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.post("/users", async (req, res) => {
    try{
        const {firstName, lastName, email, password} = req.body;
        const hashedPassword = await bcypt.hash(password, 8);

        const user = await prisma.user.create({
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

app.listen(1929, () => console.log('Server running on port 1929...'));