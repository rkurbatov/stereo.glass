module.exports = function (express, passport, Account) {
    'use strict';

    var Router = express.Router();
    var crypto = require('crypto');

    //displays our signup page
    Router.get(['/', '/login'], getLogin);
    //logs user out of site, deleting them from the session, and returns to homepage
    Router.get('/logout', getLogout);
    Router.get('/register', getRegister);

    //sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
    Router.post('/login', passport.authenticate('local'), postLogin);
    //sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
    Router.post('/register', postRegister);

    Router.post('/forgot', postForgot);

    Router.post('/check-username', postCheckUsername);
    Router.post('/check-usermail', postCheckUsermail);

    Router.get('/auth/twitter', getAuthTwitter);
    Router.get('/auth/facebook', getAuthFacebook);

    Router.get('/auth/twitter/callback', getAuthTwitterCallback);
    Router.get('/auth/facebook/callback', getAuthFacebookCallback);

    return Router;

    // === IMPLEMENTATION ===

    function getLogin(req, res) {
        if (req.isAuthenticated()) {
            return res.redirect('../admin');
        } else {
            return res.render('auth/auth');
        }
    }

    function postCheckUsername(req, res) {
        if (!req.body.username) {

        }
        Account.findOne({username: req.body.username})
            .then(function (account) {
                return account
                    ? res.sendStatus(200)
                    : res.sendStatus(204);
            })
            .catch(function (err) {
                console.log('Error: ', err);
                return res.sendStatus(500);
            });
    }

    function postCheckUsermail(req, res) {
        if (!req.body.usermail) {
            return res.sendStatus(400);
        }
        Account.findOne({usermail: req.body.usermail})
            .then(function (account) {
                return account
                    ? res.sendStatus(200)
                    : res.sendStatus(204);
            })
            .catch(function (err) {
                console.log('Error: ', err);
                return res.sendStatus(500);
            });
    }

    function postLogin(req, res) {
        if (req.user) {
            // set auth cookies;
            setInitialCookies(req, res);
        }
        if (req.query && req.query.redirect) {
            return res.redirect('/' + req.query.redirect);
        } else {
            return res.sendStatus(200);
        }
    }

    function postRegister(req, res, next) {
        if (!req.body.username || !req.body.usermail || !req.body.password) {
            return res.sendStatus(400);
        }
        console.log('registering.user ' + req.body.username);
        Account.register(new Account({
            username: req.body.username,
            usermail: req.body.usermail
        }), req.body.password, registerCallback);

        function registerCallback(err) {
            if (err) {
                console.log('error registering user! ', err);
                return res.sendStatus(500);
                //return res.render('auth/register', {account: account}).;
            }
            // http://mherman.org/blog/2013/11/11/user-authentication-with-passport-dot-js/#.VS7RauQvDVM
            console.log('user registered');
            passport.authenticate('local')(req, res, function () {
                console.log('authed after registration');
                setInitialCookies(req, res);
                return res.sendStatus(200);
                //res.redirect('../admin');
            });
        }
    }

    function getLogout(req, res, next) {
        if (req.isAuthenticated()) {
            var name = req.user.username;
            console.log("LOGGIN OUT " + name);
            req.logout();
            res.clearCookie('username');
            res.clearCookie('usermail');
            res.clearCookie('userrole');
            req.session.notice = "You have successfully been logged out " + name + "!";
        }
        if (req.query && req.query.redirect) {
            res.redirect('/' + req.query.redirect);
        } else {
            res.redirect('/');
        }
    }

    function getRegister(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('../admin');
        } else {
            res.render('auth/register');
        }
    }

    function postForgot(req, res, next) {
        //http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
        crypto.randomBytes(20, function (err, buf) {
            var token = buf.toString('hex');
            console.log(token);
        });
    }


    function getAuthTwitter() {
        return passport.authenticate('twitter');
    }

    function getAuthFacebook() {
        return passport.authenticate('facebook');
    }

    function getAuthTwitterCallback() {

    }

    function getAuthFacebookCallback() {

    }

    function setInitialCookies(req, res) {
        if (req.user.usermail) res.cookie('usermail', req.user.usermail);
        if (req.user.username) res.cookie('username', req.user.username);
        if (req.user.role) res.cookie('userrole', req.user.role);
    }

};
