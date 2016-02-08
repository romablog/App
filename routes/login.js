var Model = require('../models/model.js').Model;
var store = require('../models/model').store;


exports.post = function(req, res, next) {
  var password = req.body.password;
  var email = req.body.email;

  Model.User.findOne({ attributes:['firstName','lastName', 'email'], where: {email: email}})
      .then(function(user) {
        if (!user) {
            console.log("403 error");
          //res.sendStatus(403);
            return null
        } else {
          return store.Session.findOne({where: {sid: req.sessionID}})
              .then(function(session) {
                console.log(req.sessionID, session);
                if (!session){
                    console.log("user not find session");
                    return user;
                }
                else
                {
                    console.log("user find session");
                    return user.setSession(session)
                }
            })
        }
      })
      .then(function(user) {
          console.log("user", user);
          //if (user)
             // req.session.user = user.email;
          //done(null, user)
      });
  res.sendStatus(200);
};