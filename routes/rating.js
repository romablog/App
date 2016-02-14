var Model = require('../models/model.js').Model;

exports.getRatedCreatives = function(req, res) {
    var ratedPosts = Model.Creative.findAll({
            include: [{ model : Model.Rating, as: 'ratings'}]})
        .then(function(creatives) {
            var sum = 0;
            creatives.forEach(function(creative) {
                creative.ratings.forEach(function(rating) {
                    sum += rating.score;
                });
                creative.dataValues.score = sum / creative.ratings.length;
            });
            return creatives.sort().reverse().slice(0, 10);
        });
    ratedPosts.then(function(posts) {
        console.log(posts);
        res.send(posts);
    }, function(err) {
        console.log(err);
        res.sendStatus(402)
    });
};

exports.rateCreative = function(req, res) {
    var rating = req.body.rating;
    var id = req.body.id;
    Model.Creative.
};