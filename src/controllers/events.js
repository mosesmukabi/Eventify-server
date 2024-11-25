import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
export async function createEvent(req, res) {
    try{
        const {title, theme, image, body, number} = req.body
        const userId = req.userId
     const newEvent =   await prisma.event.create({
            data: {
                title,
                theme,
                image,
                body,
                number,
                owner: userId
            }
        })

        res.status(201).json(newEvent)
       

    } catch (error) {
        res.status(500).json({message: "something went wrong..."})
    }
}