var Model = require('../models/model.js').Model;

exports.save = function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var body = req.body.body;
    var template = req.body.template;
    var videoLink = req.body.videoLink;
    var map = req.body.map;
    var link = "link"; //cloudinary link!
    Model.Creative.create({
        name: name,
        description: description,
        body: body,
        template: template,
        videoLink: videoLink,
        imageLink: link,
        map: map
    });
    res.statusCode(200);
};