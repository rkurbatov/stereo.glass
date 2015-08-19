module.exports = function (express) {
    'use strict';

    var Router = express.Router();

    // route to render jade partials requested by angular app
    Router.get('/templates/:subdir/:name', (req, res)=> {
        var name = req.params.name;
        var subdir = req.params.subdir;

        return res.render('_templates/' + subdir + '/' + name);
    });

    Router.get('/pages/:name', (req, res)=> {
        var name = req.params.name;

        return res.render('_pages/' + name);
    });


    return Router;
};