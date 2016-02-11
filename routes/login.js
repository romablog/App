var Model = require('../models/model.js').Model;
var registrationRedirectPath = 'http://localhost:8000/app/#/';


exports.post = function(req, res, next) {
    console.log(req.body);
    var email =  req.body.email;
    var password = req.body.password;
    console.log(req.sessionID)
    Model.User.findOne({where: {email: email, password: password}})
        .then(function(user) {
            if (!user) {
              res.sendStatus(404);
            } else {
                console.log(req.body);
                req.session.user = user.authId;
                res.send(user);
            }
        })
};