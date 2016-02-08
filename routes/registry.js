var Model = require('../models/model.js').Model;

exports.post = function(req, res, next) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var surname = req.body.surname;
    var about = req.body.about;

    Model.User.create({
        theme: 'ligth',
        language: 'EN',
        firstName: username,
        lastName: surname,
        email: email,
    })
    res.statusCode(200);
    var User = sequelize.define('user', {
        theme: Sequelize.STRING,
        language: Sequelize.STRING,
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING,
        email: {
            type: Sequelize.STRING,
        },
        about: Sequelize.STRING,
        password: Sequelize.STRING
    });
};