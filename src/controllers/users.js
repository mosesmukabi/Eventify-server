import { PrismaClient } from "@prisma/client";
import bcypt from "bcryptjs";

const client = new PrismaClient();   

export const registerUser = async (req, res) => {
    try{
        const {firstName, lastName, email, password} = req.body;
        const hashedPassword = await bcypt.hash(password, 8);

        if(!firstName || !lastName || !email || !password){
            res.status(400).json({message: "all fields are required"});
            return;
        }

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
}


export async function updatePersonalInfo (req, res) {
    try{
        const {firstName, lastName, email} = req.body;
        const id = req.userId;
        const user = await client.user.update({
            where: {
                id
            },
            data: {
                firstName,  
                lastName,
                email
            }
        })
        
   
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "something went wrong..."})
    }
}





// Add the current user to the event's joined list
