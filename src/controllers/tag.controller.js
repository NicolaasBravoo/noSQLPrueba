const Tag = require('../db/models/tag');
const mongoose = require('mongoose');

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las etiquetas' });
  }
};

const getTagById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener la etiqueta solicitada' });
  }
};

const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = new Tag({ name });
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear la etiqueta' });
  }
};

const deleteTag = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }
    await tag.deleteOne();
    res.status(200).json({ message: `El tag con ID ${id} se ha borrado correctamente` });
  } catch {
    res.status(500).json({ message: 'No se puede borrar el tag solicitado' });
  }
};

const updateTag = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }
    Object.assign(tag, req.body);
    await tag.save();
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la etiqueta' });
  }
};

module.exports = { getTags, createTag, getTagById, deleteTag, updateTag };