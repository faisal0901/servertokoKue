const isLogin = (req, res, next) => {
  if (req.session.user === undefined) {
    req.flash("alertMassage", `sesi telah habis silakhan login kembali`);
    req.flash("alertStatus", "danger");
    res.redirect("/admin/login");
  } else {
    next();
  }
};
module.exports = isLogin;
