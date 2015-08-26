module.exports = function (express) {
    'use strict';

    var Router = express.Router();

    // route to render jade partials requested by angular app
    Router.get('/templates/:subdir/:name', (req, res)=> {
        var subdir = req.params.subdir;
        var name = req.params.name;

        return res.render('_templates/' + subdir + '/' + name);
    });

    Router.get('/pages/:subdir/:name', (req, res)=> {
        var subdir = req.params.subdir;
        var name = req.params.name;

        return res.render('_pages/' + subdir + '/' + name);
    });


    return Router;
};