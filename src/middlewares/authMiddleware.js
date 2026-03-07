function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  return res.redirect("/login.html");
}

function requireGuest(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect("/index");
  }

  return next();
}

module.exports = {
  requireAuth,
  requireGuest
};