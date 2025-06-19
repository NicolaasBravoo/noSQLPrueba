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
    ref: 'post'
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  }
}, {
  timestamps: true //  Esta es la forma correcta
});

module.exports = mongoose.model('comment', commentSchema);