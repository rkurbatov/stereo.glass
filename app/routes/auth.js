module.exports = function (express, passport, Account) {
    'use strict';

    var Router = express.Router();

    //displays our signup page
    Router.get(['/', '/login'], getLogin);
    //logs user out of site, deleting them from the session, and returns to homepage
    Router.get('/logout', getLogout);
    Router.get('/register', getRegister);

    //sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
    Router.post('/login', passport.authenticate('local', {
        successRedirect: '../admin',
        failureRedirect: '/auth'
    }));
    //sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
    Router.post('/register', postRegister);

    return Router;

    // === IMPLEMENTATION ===

    function getLogin(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('../admin');
        } else {
            res.render('auth/auth');
        }
    }

    function getLogout(req, res, next) {
        if (req.isAuthenticated()) {
            var name = req.user.username;
            console.log("LOGGIN OUT " + name);
            req.logout();
            req.session.notice = "You have successfully been logged out " + name + "!";
        }
        res.clearCookie('username');
        res.clearCookie('usermail');
        res.clearCookie('userrole');
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

    function postRegister(req, res, next) {
        console.log('registering.user ' + req.body.username);
        Account.register(new Account({
            username: req.body.username,
            usermail: req.body.usermail
        }), req.body.password, function (err, account) {
            // http://mherman.org/blog/2013/11/11/user-authentication-with-passport-dot-js/#.VS7RauQvDVM
            if (err) {
                console.log('error registering user!');
                return res.render('auth/register', {account: account});
            }
            console.log('user registered');

            passport.authenticate('local')(req, res, function () {
                console.log('authed after registration');
                res.redirect('../admin');
            });
        });
    }
};
