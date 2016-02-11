var async = require('async');
var conf = require('../config');
var util = require('util');
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
    name: Sequelize.STRING,
    description: Sequelize.TEXT,
    body: Sequelize.TEXT,
    template: Sequelize.TEXT,
    imageLink: Sequelize.STRING
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

//User.belongsTo(store.Session, {foreignKeyConstraint: true});

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

var Model = {
    Comment: Comment,
    Rating: Rating,
    CommentRating: CommentRating,
    Creative: Creative,
    User: User,
    Medal: Medal,
    Category: Category,
    Tag: Tag
};



sequelize.sync({force: true})
    .then(function() {
        return Model.User.bulkCreate([
            {firstName: 'JOHN', lastName: 'DOE', email: 'roma@roma.roma', password: '123'},
            {firstName: 'JACK', lastName: 'DOE'}
        ])
    })
    .then(function(user) {
        return Model.User.findAll()})
    .then(function(users) {
    })
    .then(function(){
        return Model.User.create({firstName: 'JANE', lastName: 'DOE'});
    })
    .then(function() {
        return Model.User.findAll({where:{lastName: 'DOE'}})
    })
    .then(function(users){
        users.forEach(function(user) {
        })
    });

//exports.store = store;
exports.Model = Model;
