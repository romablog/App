var Model = require('../models/model.js').Model;


exports.post = function(req, res, next) {
    var email =  req.body.email;
    var password = req.body.password;
    console.log(req.session.sessionID);
    Model.User.findOne({where: {email: email, password: password}})
        .then(function(user) {
            //console.log(user);
            if (!user) {
              res.sendStatus(404);
            } else {

                req.session.user = user.authId;
                res.send(user);
            }
        })
};