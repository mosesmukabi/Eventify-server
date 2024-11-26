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

export async function fetchSingleEvent(req, res) {
    try{
        const {id} = req.params
        const event = await prisma.event.findFirst({
            where: {
                id
            },
            include: {
                user: true
            }
        })
        if(!event){
            res.status(404).json({message: "event not found!"})
            return;
        }
        res.status(200).json(event)

    } catch (error) {
        res.status(500).json({message: "something went wrong..."})  
    }
}


export async function fetchAllEvents(req, res) {
    try {
        const notes = await prisma.event.findMany({
            include: {
                user: true
            }


        })
        res.status(200).json(notes)
       
    } catch (error) {
        res.status(500).json({ message: "something went wrong..." });
    }
}


export async function getUserEvents(req, res) {
    try {
        const userId = req.userId
        const events = await prisma.event.findMany({
            where: {
                owner: userId
            }
        })
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({ message: "something went wrong..." });
    }
}
