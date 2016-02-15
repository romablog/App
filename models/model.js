var async = require('async');
var conf = require('../config');
var util = require('util');
var Promise = require('bluebird');
var Sequelize = require('sequelize');
var cloudinary = require('../libs/cloudinary');


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
    },
    {
        hooks: {
            beforeDestroy : function(creative) {
                cloudinary.destroy(creative.url);
            }
    }
});

var Icon = sequelize.define('icon', {
    url: Sequelize.STRING,
    publicId: Sequelize.STRING
});

var Category = sequelize.define('category', {
    name: Sequelize.TEXT
});
var Tag = sequelize.define('tag', {
    name: Sequelize.STRING
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
var CreativeRating = sequelize.define('CreativeRating',{
    score: Sequelize.INTEGER
});
var UserRating = sequelize.define('user_rating', {
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

//CreativeRating.belongsTo(User);
User.hasMany(CreativeRating);
Creative.hasMany(CreativeRating);

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
    Icon: Icon,
    CreativeRating : CreativeRating,
    AddScores: function(creatives, ratings) {
        var sums = ratings.map(function(ratings) {
            var sum = 0;
            ratings.forEach(function(rating) {
                sum += rating.score;
            });
            return sum;
        });
        for (var i = 0; i < creatives.length; i++) {
            creatives[i].dataValues.score = sums[i];
        }
        return creatives;
    }
};

sequelize.sync({force: true}).then(function() {
    return Promise.all([Model.Creative.create({
        title: 'title',
        article : 'article'
    }), Model.CreativeRating.create({
        score: 4
    }), Model.User.create(
        {firstName: 'JOHN', lastName: 'DOE', email: 'roma@roma.roma', password:'roma', authId:"12345"})])
}).spread(function(creative, rating, johnny) {
    console.log(johnny);
    return [johnny.addCreative(creative), creative.addCreativeRating(rating)]
});

exports.Model = Model;
