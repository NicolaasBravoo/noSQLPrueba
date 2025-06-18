const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true //  Esta es la forma correcta
});

module.exports = mongoose.model('comment', commentSchema);