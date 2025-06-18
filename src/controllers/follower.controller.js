const Follower = require('../db/models/follower'); // Modelo mongoose
const mongoose = require('mongoose');

const followUser = async (req, res) => {
  try {
    const { followerId, followedId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(followerId) || !mongoose.Types.ObjectId.isValid(followedId)) {
      return res.status(400).json({ message: "IDs inválidos." });
    }

    if (followerId === followedId) {
      return res.status(400).json({ message: "No puedes seguirte a ti mismo." });
    }

    // Buscamos si ya existe la relación
    const existing = await Follower.findOne({ followerId, followedId });

    if (existing) {
      return res.status(400).json({ message: "Ya estás siguiendo a este usuario." });
    }

    // Si no existe, creamos la relación
    const newFollower = new Follower({ followerId, followedId });
    await newFollower.save();

    res.status(201).json(newFollower);
  } catch (error) {
    res.status(500).json({ error: 'Error al seguir al usuario.' });
  }
};

module.exports = { followUser };