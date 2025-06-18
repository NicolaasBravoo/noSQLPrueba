const mongoose = require('mongoose');
const { Schema } = mongoose;

const postImageSchema = new Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
}, {
  timestamps: false, // Mantenemos la lógica del modelo original
});

// Usamos mongoose.models para evitar redefinir el modelo
module.exports = mongoose.models.postImage || mongoose.model('postImage', postImageSchema);
