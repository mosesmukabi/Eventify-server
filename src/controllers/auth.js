import { PrismaClient } from "@prisma/client";
import bcypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new PrismaClient();
export const loginUser = async (req, res) => {
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
        console.log(error);
        res.status(500).json({message: "something went wrong..."})
    }
}