var Model = require('../models/model.js').Model;

exports.get = (function(req, res) {
    Model.User.findAll()
        .then(function(users) {

            res.send({one: users.length});
        });
});
