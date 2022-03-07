const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  comment: String,
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model('Comment', CommentSchema)