var express = require('express');
var router = express.Router();
var Model = require('../models/model.js').Model;

exports.get = (function(req, res) {
    Model.User.findAll()
        .then(function(users) {

            res.send({one: users.length});
        });
});
