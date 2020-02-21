const mongoose = require('mongoose');

// post database scheme
const postSchema = mongoose.Schema({
  title: { type: String, require },
  body: { type: String, require },
  author: String,
  image: String,
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
