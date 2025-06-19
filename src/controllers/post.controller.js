const Post = require('../db/models/post');
const PostImage = require('../db/models/postImage');
const Comment = require('../db/models/comment');
const Tag = require('../db/models/tag');
const cache = require('../../utils/cache');
const mongoose = require('mongoose');

// Obtener todos los posts con IDs de comentarios y tags asociados
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().select('-__v');

    const postsWithRelations = await Promise.all(
      posts.map(async (post) => {
        const commentIds = await Comment.find({ post: post._id }).select('_id');
        const tagIds = await Tag.find({ posts: post._id }).select('_id');
        const imageIds = await PostImage.find({ post: post._id }).select('_id');

        return {
          ...post.toJSON(),
          comments: commentIds.map(c => c._id),
          tags: tagIds.map(t => t._id),
          images: imageIds.map(i => i._id)
        };
      })
    );

    res.status(200).json(postsWithRelations);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
};

const getPostById = async (req, res) => {
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  const cachedPost = cache.get(`post_${postId}`);
  if (cachedPost) {
    console.log('📦 Devolviendo post desde cache');
    return res.status(200).json(cachedPost);
  }

  try {
    const post = await Post.findById(postId).select('-__v');
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    const commentIds = await Comment.find({ post: postId }).select('_id');
    const tagIds = await Tag.find({ posts: postId }).select('_id');
    const imageIds = await PostImage.find({ post: postId }).select('_id');

    const postWithRelations = {
      ...post.toJSON(),
      comments: commentIds.map(c => c._id),
      tags: tagIds.map(t => t._id),
      images: imageIds.map(i => i._id)
    };

    cache.set(`post_${postId}`, postWithRelations);
    console.log('🛠️ Post obtenido desde la base de datos con relaciones');

    res.status(200).json(postWithRelations);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el post' });
  }
};


// Crear nuevo post y subir imágenes asociadas
const createPost = async (req, res) => {
  try {
    const { description, user } = req.body;

    if (!description || !user) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: description o user' });
    }

    const newPost = new Post({ description, user });
    await newPost.save();

    if (req.files && req.files.length > 0) {
      const imagesToCreate = req.files.map(file => ({
        post: newPost._id,
        url: `/images/${file.filename}`
      }));

      const savedImages = await PostImage.insertMany(imagesToCreate);
      newPost.images = savedImages.map(img => img._id);
      await newPost.save();
    }

    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error al crear post:', err);
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

module.exports = {
  getPosts,
  createPost,
  getPostById,
  deletePost,
  updatePost
};
