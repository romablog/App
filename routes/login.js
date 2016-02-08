var registrationRedirectPatn = "http://localhost:63342/Final_Proj/app/index.html";

exports.get = function(req, res, next) {
  var password = req.body.password;
  var email = req.body.email;
  res.sendStatus(200);
};