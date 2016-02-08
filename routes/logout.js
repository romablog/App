var registrationRedirectPatn = "http://localhost:63342/Final_Proj/app/index.html";

exports.post = function(req, res) {
  res.locals.user = null;
  res.redirect(registrationRedirectPatn);
};

exports.get = function(req, res) {
  res.status(403).send({name : "artur"})
};