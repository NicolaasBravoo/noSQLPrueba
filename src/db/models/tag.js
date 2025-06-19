const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'post'
  }]
}, {
  timestamps: false
});

module.exports = mongoose.model('tag', tagSchema);