var elastic = require('../libs/elastic');
var Model = require('../models/model.js').Model;
var Promise = require('bluebird');

//TODO достать пост по тэгу по комменту
exports.get = function(req, res) {

    //var tagPosts = elastic.getSuggestions("tag", req.params.input).then(function (result) {
    //    var afterTag = result.docsuggest[0].options;
    //    return Promise.all(afterTag.map(function (tag) {
    //        return Model.Tag.findOne({ where: {name: tag.text}}).then(function(tag){
    //            return tag;
    //        });
    //    }));
    //});

    var userPosts = elastic.getSuggestions("user", req.params.input).then(function (result) {
        var afterUser = result.docsuggest[0].options;
        return Promise.all(afterUser.map(function (userObj) {
            return Model.User.findOne({ where: {authId: userObj.text}}).then(function(user){
                return user.getCreatives();
            });
        }));
    });

    //var commentPosts = elastic.getSuggestions("comment", req.params.input).then(function (result) {
    //    var afterComment = result.docsuggest[0].options;
    //    return Promise.all(afterComment.map(function (commentObj) {
    //        return Model.Comment.findOne({ where: {body: commentObj.text}}).then(function(comment){
    //            return comment;
    //        });
    //    }));
    //});

    var creativePosts = elastic.getSuggestions("creative", req.params.input).then(function (result) {
        var afterUser = result.docsuggest[0].options;
        return Promise.all(afterUser.map(function (creativeObj) {
            return Model.Creative.findOne({ where: {title: creativeObj.text}}).then(function(creative){
                return creative;
            });
        }));
    });

    Promise.all([ userPosts, creativePosts]).then(function(posts){
        var temp = [].concat.apply([], posts);
        var result = [].concat.apply([], temp);
        result = result.unique();
        res.json({posts: result})
    })
};

Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i].id] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};

//var commentPosts = elastic.getSuggestions("comment", req.params.input).then(function (result) {
//    var afterComment = result.docsuggest[0].options;
//    var arr = [];
//    afterComment.map(function (commentObj) {
//        return Model.Comment.findOne({ where: {body: commentObj.text}}).then(function(comment){
//            return arr.concat([1,2,3]);
//        });
//    });
//    return arr;
//});