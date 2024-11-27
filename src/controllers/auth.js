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


export async function updatePassword(req, res) {
    try {
      const id = req.userId; // Assuming req.userId is populated from a middleware
      const { oldPassword, newPassword } = req.body;
  
      // Find user in database
      const user = await client.user.findFirst({ where: { id } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if oldPassword matches the current password
      const theyMatch = await bcypt.compare(oldPassword, user.password);
      if (!theyMatch) {
        // Respond with a 400 Bad Request status for incorrect password
        return res.status(400).json({ message: "Incorrect old password" });
      }
  
      // Hash and update the new password
      const hashedPassword = await bcypt.hash(newPassword, 8);
      await client.user.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      });
  
      // Respond with success
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  