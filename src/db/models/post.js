const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },

  // Autor del post (relación con User)
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Relación con imágenes
  images: [{
    type: Schema.Types.ObjectId,
    ref: 'PostImage'
  }],

  // Relación con comentarios
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],

  // Relación muchos a muchos con tags
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }]
}, {
  timestamps: true // Registra createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('post', postSchema);