const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const contentSchema = mongoose.Schema({
  name: String,
  data: String,
});

module.exports = mongoose.model('Content', contentSchema);
