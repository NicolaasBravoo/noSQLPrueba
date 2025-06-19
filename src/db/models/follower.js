const mongoose = require('mongoose');
const { Schema } = mongoose;

const followerSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  followed: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: false
});

module.exports = mongoose.model('follower', followerSchema);