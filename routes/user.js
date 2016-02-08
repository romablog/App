var express = require('express');
var router = express.Router();
var Model = require('../models/model.js').Model;
/* GET users listing. */
router.get(function(req, res) {
    Model.User.findAll()
        .then(function(users) {
            res.send({one: "1"});
        });
});

module.exports = router;
