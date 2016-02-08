var registrationRedirectPatn = "http://localhost:63342/Final_Proj/app/index.html";

exports.post = function(req, res, next) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var surname = req.body.surname;
    var about = req.body.about;
    res.redirect(registrationRedirectPatn);
};