var checkAuth = require('../middleware/checkAuth');

module.exports = function(app) {

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    //app.get('/', require('./mainpage').get);

    app.post('/registry', require('./registry').post);
    app.post('/logout', require('./logout').post);
    app.get('/login', require('./login').get)
};