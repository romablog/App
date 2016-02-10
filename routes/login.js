var Model = require('../models/model.js').Model;
var registrationRedirectPath = 'http://localhost:8000/app/#/';


exports.post = function(req, res, next) {
    var email =  req.body.email;
    var password = req.body.password;
    Model.User.findOne({where: {email: email, password: password}})
        .then(function(user) {
            if (!user) {
              res.sendStatus(403);
            } else {
              req.session.user = user.authId;
              res.sendStatus(200);
            }
        })
};