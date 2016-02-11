var Model = require('../models/model.js').Model;
var cloudinary = require('../libs/cloudinary');
var conf = require('../config');
var fs = require('fs');

exports.post = function(req, res) {
    cloud(req, res);
};

function cloud(req, res) {
    var path = __dirname + '/'+ req.session.user +'.jpg';
    var buff = new Buffer(req.body.img.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
    fs.writeFile(path, buff);
    cloudinary.uploadToCloudinary(path, function(result){
        addModel(req, res ,result.url, result.public_id);
        fs.unlink(path);
    });
}

function addModel(req, res, link, publicId) {
    var title = req.body.title;
    var description = req.body.description;
    var article = req.body.article;
    var template = req.body.template;
    var videoLink = req.body.videoLink;
    var map = req.body.map;
    Model.User.findOne({
        where: {
            authId: req.session.user
        }
    }).then(function(user) {
        return [user, Model.Creative.create({
            title: title,
            description: description,
            template: template,
            article: article,
            imageLink: link,
            videoLink: videoLink,
            map: map
        })]
    }).spread(function(user, creative) {
        return [user.addCreative(creative), creative];
    }).spread(function(user ,creative) {
        return [Model.Image.create({
            url: link,
            publicId: publicId
        }), creative];
    }).spread (function(image, creative) {
        console.log(image);
        return creative.setImage(image);
    }).then (function(){
        res.sendStatus(200);
    }, function(){
        res.sendStatus(403);
    });
}