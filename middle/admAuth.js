function authAdm(req, res, next) {
  try {
    if (req.session.user.status == "1") {
       
      next();
    } else {
      res.redirect("/");
    }
  } catch {
    res.redirect("/");
  }
}

module.exports = authAdm;
