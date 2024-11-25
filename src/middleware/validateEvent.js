function validateEvent(req, res, next) {
    const {title, theme, image, body, number} = req.body;
    if(!title || !theme || !image || !body || !number){
        res.status(400).json({message: "all fields are required"});
        return;
    }
    next();
}


export default validateEvent