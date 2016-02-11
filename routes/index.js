var passport = require('passport');

module.exports = function(app) {

    app.use( '/', function( req, res, next ) {
        res.header("Access-Control-Allow-Origin", "http://localhost:8000");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
        res.header("Access-Control-Allow-Headers", "Content-Type, *");
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, PATCH");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

    app.post('/login', require('./login').post);
    app.post('/registry', require('./registry').post);
    app.post('/logout', require('./logout').post);
    app.post('/post/save', require('./post').save);

    //userpublications

    //save post

    //cloudinary to server

    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook'), require('./social').log);

    app.get('/auth/vkontakte', passport.authenticate('vkontakte'));
    app.get('/auth/vkontakte/callback', passport.authenticate('vkontakte'), require('./social').log);

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter'), require('./social').log);
};