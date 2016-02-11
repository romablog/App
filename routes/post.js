var Model = require('../models/model.js').Model;

exports.save = function(req, res) {
    console.log(req.sessionID, req.session.user);
    var title = req.body.title;
    var description = req.body.description;
    var article = req.body.article;
    var template = req.body.template;
    var videoLink = req.body.videoLink;
    var map = req.body.map;
    var link = "link"; //cloudinary link!
    console.log('HERE');
    Model.User.findOne({
        where: {
            authId: req.session.user
        }
    }).then(function(user) {
        console.log(user.firstName);
        return [user, Model.Creative.create({
            title: title,
            description: description,
            article: article,
            imageLink: link,
            videoLink: videoLink,
            map: map
        })]
    }).spread(function(user, creative) {
        console.log(creative);
        return user.addCreative(creative);
    }).then(function() {
        res.sendStatus(200);
    }, function() {
        res.sendStatus(403);
    });
    //Model.Creative.create({
    //    name: name,
    //    description: description,
    //    body: body,
    //    template: template,
    //    videoLink: videoLink,
    //    imageLink: link,
    //    map: map
    //});

};