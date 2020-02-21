const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const adminSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('admin', adminSchema);
