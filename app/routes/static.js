module.exports = function (express) {
    'use strict';

    var Router = express.Router();

    // route to render jade partials requested by angular app
    Router.get('/partials/:name', function (req, res, next) {
        var name = req.params.name;
        res.render('_partials/' + name);
    });

    Router.get('/pages/:name', function (req, res, next) {
        var name = req.params.name;
        res.render('_pages/' + name);
    });


    return Router;
};