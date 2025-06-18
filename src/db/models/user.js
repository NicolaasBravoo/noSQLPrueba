const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  nickName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },

  // Relación con Post
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],

  // Relación con Comment
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],

  // Seguidores (quienes lo siguen)
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  // A quiénes sigue
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: false
});



module.exports = mongoose.model('user', userSchema);