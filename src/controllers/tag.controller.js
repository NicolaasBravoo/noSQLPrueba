const Tag = require('../db/models/tag');
const mongoose = require('mongoose');
const Post = require('../db/models/post'); // Asegurate de importar el modelo


// Obtener todos los tags con solo ids de posts asociados
const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();

    const tagsWithPostIds = tags.map(tag => ({
      ...tag.toJSON(),
      posts: tag.posts.map(postId => postId.toString())
    }));

    res.status(200).json(tagsWithPostIds);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las etiquetas' });
  }
};

// Obtener un tag por ID con sólo ids de posts asociados
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

    const tagWithPostIds = {
      ...tag.toJSON(),
      posts: tag.posts.map(postId => postId.toString())
    };

    res.status(200).json(tagWithPostIds);
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

// Asignar un post a un tag
const assignTagToPost = async (req, res) => {
  const tagId = req.params.id;
  const { postId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(tagId) || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'ID de tag o post inválido' });
  }

  try {
    const tag = await Tag.findById(tagId);
    if (!tag) return res.status(404).json({ message: 'Etiqueta no encontrada' });

    // Evitar duplicados
    if (!tag.posts.includes(postId)) {
      tag.posts.push(postId);
      await tag.save();
    }

    res.status(200).json({ message: 'Post asignado correctamente al tag', tagId, postId });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar el post al tag' });
  }
};

// Remover un post de un tag
const removeTagFromPost = async (req, res) => {
  const tagId = req.params.id;
  const { postId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(tagId) || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'ID de tag o post inválido' });
  }

  try {
    const tag = await Tag.findById(tagId);
    if (!tag) return res.status(404).json({ message: 'Etiqueta no encontrada' });

    tag.posts = tag.posts.filter(id => id.toString() !== postId);
    await tag.save();

    res.status(200).json({ message: 'Post removido del tag correctamente', tagId, postId });
  } catch (error) {
    res.status(500).json({ message: 'Error al remover el post del tag' });
  }
};




module.exports = { getTags, createTag, getTagById, deleteTag, updateTag, assignTagToPost, removeTagFromPost };