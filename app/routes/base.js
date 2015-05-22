module.exports = function (express, Account) {
    'use strict';

    var Router = express.Router();

    // server routes ===========================================================
    Router.get(['/'], function(req, res, next){
        res.render('main/index', { user: req.user });
    });

    // admin interface
    Router.get(['/admin'], function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user._id) {
                Account.findByIdAndUpdate(req.user._id, {activeAt: new Date}, function (err) {
                    if (err) console.log(err); 
                });
            }
            res.render('admin/index', {user: req.user});
        } else {
            res.redirect('/auth');
        }
    });

    Router.get('/ping', function(req, res){
        if (res.isAuthenticated) res.status(200).send("pong!");
        else {
            res.status(200).send("pang!");
        }
    });

    // route to render jade partials requested by angular app
    Router.get('/partials/:name', function (req, res, next) {
        var name = req.params.name;
        res.render('_partials/' + name);
    });

    return Router;
};