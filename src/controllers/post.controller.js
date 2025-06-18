const Post = require('../db/models/post');
const PostImage = require('../db/models/postImage');
const Comment = require('../db/models/comment');
const Tag = require('../db/models/tag');
const cache = require('../../utils/cache');
const mongoose = require('mongoose');

// Obtener todos los posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
};

// Obtener post por ID con populates (comments, images, tags)
const getPostById = async (req, res) => {
  const postid = req.params.id;

  // Validar ObjectId
  if (!mongoose.Types.ObjectId.isValid(postid)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  // Revisar cache
  const cachedPost = cache.get(`post_${postid}`);
  if (cachedPost) {
    console.log('📦 Devolviendo post desde cache');
    return res.status(200).json(cachedPost);
  }

  try {
    const post = await Post.findById(postid)
      .populate('comments')
      .populate('images')
      .populate('tags');

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    cache.set(`post_${postid}`, post);

    console.log('🛠️ Post obtenido desde la base de datos');
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener el post' });
  }
};

// Crear nuevo post y subir imágenes asociadas
const createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();

    if (req.files && req.files.length > 0) {
      const imagesToCreate = req.files.map(file => ({
        post: newPost._id,
        url: `/images/${file.filename}`
      }));

      await PostImage.insertMany(imagesToCreate);
    }

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el post' });
  }
};

// Eliminar post por ID
const deletePost = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const removed = await Post.findByIdAndDelete(id);
    if (!removed) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    cache.del(`post_${id}`);

    res.status(200).json({ message: `El posteo con ID ${removed._id} se ha borrado correctamente` });
  } catch {
    res.status(500).json({ message: 'Error al borrar el post' });
  }
};

// Actualizar post por ID
const updatePost = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const post = await Post.findByIdAndUpdate(id, req.body, { new: true });
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    cache.del(`post_${id}`);

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el post' });
  }
};

// Obtener comentarios asociados a un post
const getCommentsByPost = async (req, res) => {
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const comments = await Comment.find({ post: postId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los comentarios del post' });
  }
};

// Asignar tags a un post (tags ya existentes)
const addTagsToPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { tagIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'ID de post inválido' });
    }

    // Validar ids de tags
    for (const tagId of tagIds) {
      if (!mongoose.Types.ObjectId.isValid(tagId)) {
        return res.status(400).json({ message: `ID de tag inválido: ${tagId}` });
      }
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    // Verificar que los tags existan
    const tags = await Tag.find({ _id: { $in: tagIds } });
    if (tags.length !== tagIds.length) {
      return res.status(400).json({ message: 'Uno o más tags no existen' });
    }

    // Agregar tags (sin duplicados)
    post.tags = [...new Set([...post.tags.map(t => t.toString()), ...tagIds])];
    await post.save();

    res.status(200).json({ message: 'Tags asignados correctamente al post' });
  } catch (err) {
    res.status(500).json({ error: 'Error al asignar los tags al post' });
  }
};

// Obtener tags asociados a un post
const getTagsByPost = async (req, res) => {
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    const post = await Post.findById(postId).populate('tags');

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.status(200).json(post.tags);
  } catch (error) {
    console.error("Error al obtener los tags:", error);
    res.status(500).json({ error: 'Error al obtener los tags del post' });
  }
};

module.exports = {
  getPosts,
  createPost,
  getPostById,
  deletePost,
  updatePost,
  getCommentsByPost,
  addTagsToPost,
  getTagsByPost
};
