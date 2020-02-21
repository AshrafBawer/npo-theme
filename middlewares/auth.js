
// checks wether the admin is loged in or not
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/admin');
};
