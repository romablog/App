var Model = require('../models/model.js').Model;
var uuid = require('uuid');

exports.post = function(req, res, next) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var surname = req.body.surname;
    var about = req.body.about;
    Model.User.create({
        authId: uuid.v1(),
        theme: 'ligth',
        language: 'EN',
        firstName: username,
        lastName: surname,
        email: email,
        about: about
    });
    res.statusCode(200);
};