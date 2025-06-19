const User = require('../db/models/user');
const mongoose = require('mongoose');

// Devuelve todos los usuarios con relaciones
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('followers')   // followers que te siguen (ojo que depende cómo definiste el esquema)
      .populate('following')  // usuarios a los que sigue
      ;
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Ocurrió un error al obtener usuarios' });
  }
};

// Devuelve un usuario por ID con relaciones
const getUserById = async (req, res) => {
  const _id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const user = await User.findOne({ _id });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'No se pudo obtener el usuario solicitado' });
  }
};

// Crea un usuario
const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Ocurrió un error al crear el usuario' });
  }
};

// Borra un usuario
const deleteUser = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await user.deleteOne();
    res.status(200).json({ message: `El usuario con ID ${id} se ha borrado correctamente` });
  } catch (error) {
    res.status(500).json({ message: 'No se puede borrar el usuario solicitado' });
  }
};

// Actualiza un usuario
const updateUser = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    Object.assign(user, req.body);
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

module.exports = { getUsers, getUserById, createUser, deleteUser, updateUser };