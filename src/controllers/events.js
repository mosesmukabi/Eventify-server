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


export async function deleteEvent(req, res) {
    try {
        const {id} = req.params
        const userId = req.userId
        const event = await prisma.event.delete({
            where: {
                id,
                owner: userId
            }
        })
        res.status(200).json("noted deleted successfully")
    } catch (error) {
        res.status(500).json({ message: "something went wrong..." });
    }
}


export async function updateEvent(req, res) {
    try {
        const {id} = req.params
        const userId = req.userId
        const {title, theme, image, body, number} = req.body
        const event = await prisma.event.update({
            where: {
                id,
                owner: userId
            },
            data: {
                title,
                theme,
                image,
                body,
                number
            }
        })
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({ message: "something went wrong..." });
    }
}


export const getUserProfile = async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile" });
    }
  };




  export async function joinEvent(req, res) {
    try {
      const userId = req.userId; // Set by authentication middleware
      const eventId = req.params.id;
  
      if (!userId || !eventId) {
        return res.status(400).json({ message: "User ID or Event ID is missing." });
      }
  
      await prisma.event.update({
        where: { id: eventId },
        data: {
          joinedBy: {
            connect: { id: userId },
          },
        },
      });
  
      res.status(200).json({ message: "Successfully joined the event!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Could not join the event." });
    }
  }
  
  
  // Remove the current user from the event's joined list
  export async function cancelEvent (req, res) {
    try {
      const id = req.userId; // Assume userId is set by authentication middleware
      const eventId = req.params.id;
  
      await prisma.event.update({
        where: { id: eventId },
        data: {
          joinedBy: {
            disconnect: { id }, // Remove the user from the joinedBy list
          },
        },
      });
  
      res.status(200).json({ message: "Successfully canceled your event participation!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Could not cancel the event." });
    }
  };
  
  // Fetch all events the user has joined
  export async function getJoinedEvents (req, res) {
    try {
      const id = req.userId; // Assume userId is set by authentication middleware
  
      const joinedEvents = await prisma.event.findMany({
        where: {
          joinedBy: {
            some: { id }, // Filter for events the user has joined
          },
        },
        include: {
          user: true, // Include event owner details if needed
        },
      });
  
      res.status(200).json(joinedEvents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Could not fetch joined events." });
    }
  };