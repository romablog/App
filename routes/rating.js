var Model = require('../models/model.js').Model;
var Promise = require('bluebird');
exports.getRatedCreatives = function (req, res) {
    var ratedPosts = Model.Creative.findAll()
        .then(function (creatives) {
            var ratings = Promise.all(creatives.map(function (creative) {
                return creative.getCreativeRatings();
            }));
            return [creatives, ratings];
        })
        .spread(function (creatives, ratings) {
            for (var i = 0; i < creatives.length; i++) {
                creatives[i].ratings = ratings[i];
            }
            var sum = 0;
            creatives.forEach(function (creative) {
                creative.ratings.forEach(function (rating) {
                    sum += rating.score;
                });
                creative.dataValues.score = sum / creative.ratings.length;
            });
            return creatives.sort().reverse().slice(0, 10);
        });
    ratedPosts.then(function (posts) {
        console.log(posts);
        res.send(posts);
    }, function (err) {
        console.log(err);
        res.sendStatus(402)
    });
};

exports.rateCreative = function (req, res) {
    var score = req.body.score;
    var id = req.body.id;
    var sum = 0;
    var currentUser =
        Model.User.findOne({where: {authId: req.session.user}});
    var currentCreative =
        Model.Creative.findById(id);
    var creativeRatings =
        currentCreative.then(function (creative) {
            return creative.getCreativeRatings();
        });
    var userRatings =
        currentUser.then(function (user) {
            return user.getCreativeRatings();
        });

    Promise.all([creativeRatings, userRatings, currentUser])
        .spread(function (creativeRatings, userRatings, user) {
            creativeRatings.forEach(function (rating) {
                //console.log(rating);
                sum += rating.score;
            });
            if (creativeRatings.some(function (creativeRating) {
                    console.log("CRE USER & USER", creativeRating.userId, user.id );
                    return creativeRating.userId == user.id;
                })) {
                res.sendStatus(403);
            } else {
                return [Model.CreativeRating.create({score: score}), currentUser, currentCreative];
            }
        })
        .spread(function (creativeRating, user, creative) {
            return [user.addCreativeRating(creativeRating), creative.addCreativeRating(creativeRating)];
        })
        .then(function () {
            res.send({score: sum + score});
        });
};