const mongoose = require('mongoose');

module.exports = mongoose.model('Donor', {
  url: { type: String, require },
});
