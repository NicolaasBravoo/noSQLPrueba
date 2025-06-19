const  PostImage = require("../db/models/postimage")

const validId = (req, res, next) => {
    
    const id = req.params.id

    if (id <= 0) {
        return res.status(400).json({message: "Bad request: la imagen no puede tener id negativo"})
    }
    next();
};

const existsPostImage = async (req, res, next) => {
    
    const id = req.params.id;
    const data = await PostImage.findByPk(id);

    if (!data) {
        return res.status(404).json({ message: `No existe la imagen de posteo con id ${id}`})
    }
    next();
};

module.exports = { validId, existsPostImage }