var registrationRedirectPatn = "http://localhost:8000/app/#/";

exports.post = function(req, res) {
  res.locals.user = null;
  res.sendStatus(200);
};

exports.get = function(req, res) {
  res.sendStatus(403);
};