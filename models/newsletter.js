const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// newsletter subscribers list schema
const subscriberSchema = mongoose.Schema({
  first_name: String,
  email: String,
});

exports.module = mongoose.model('Subscriber', subscriberSchema);
