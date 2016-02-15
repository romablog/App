var async = require('async');
var conf = require('../config');
var util = require('util');
var Promise = require('bluebird');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(conf.get('DB:table'), conf.get('DB:user'), conf.get('DB:password'), {
    host:  conf.get('DB:host'),
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

var Creative = sequelize.define('creative', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    article: Sequelize.TEXT,
    template: Sequelize.TEXT,
    imageLink: Sequelize.STRING,
    videoLink: Sequelize.STRING,
    map: Sequelize.STRING,
    url: Sequelize.STRING,
    publicId: Sequelize.STRING
});

var Icon = sequelize.define('icon', {
    url: Sequelize.STRING,
    publicId: Sequelize.STRING
});

var Category = sequelize.define('category', {
    name: Sequelize.TEXT
});
var Tag = sequelize.define('tag', {
    name: Sequelize.TEXT
});
var User = sequelize.define('user', {
    authId: Sequelize.STRING,
    password: Sequelize.STRING,
    theme: Sequelize.STRING,
    language: Sequelize.STRING,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    about: Sequelize.STRING,
    email: {
        type: Sequelize.STRING
    }
});

var Rating = sequelize.define('rating', {
    score: Sequelize.INTEGER
});

var Comment = sequelize.define('comment', {
    body: Sequelize.TEXT
});
var CommentRating = sequelize.define('comment_rating', {

});
var Medal = sequelize.define('medal', {
    name: Sequelize.TEXT,
    imageLink: Sequelize.STRING
});

User.hasMany(Creative);

Creative.belongsToMany(Tag, {through: "CreativeTag"});
Tag.belongsToMany(Creative, {through: "CreativeTag"});

Creative.belongsTo(Category);

User.belongsToMany(Medal, {through: "UserMedal"});
Medal.belongsToMany(User, {through: "UserMedal"});

Rating.belongsTo(User);
Creative.hasMany(Rating);

Creative.hasMany(Comment);
Comment.belongsTo(User);

CommentRating.belongsTo(User);
Comment.hasMany(Comment);

User.hasOne(Icon);

var Model = {
    Comment: Comment,
    Rating: Rating,
    CommentRating: CommentRating,
    Creative: Creative,
    User: User,
    Medal: Medal,
    Category: Category,
    Tag: Tag,
    Icon: Icon
};

sequelize.sync({force: true}).then(function() {
    return Promise.all([Model.Creative.create({
        title: 'title',
        article : 'article'
    }), Model.Rating.create({
        score: 4
    }), Model.User.create(
        {firstName: 'JOHN', lastName: 'DOE', email: 'roma@roma.roma', password:'roma', authId:"12345"})])
}).spread(function(creative, rating, johnny) {
    console.log(johnny);
    return [johnny.addCreative(creative), creative.addRating(rating)]
});

exports.Model = Model;
