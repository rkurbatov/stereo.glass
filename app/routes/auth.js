module.exports = function (express, passport, crypto, Account) {
    'use strict';

    var Router = express.Router();

    //displays our signup page
    Router.get(['/'], getLogin);
    //logs user out of site, deleting them from the session, and returns to homepage
    Router.get('/logout', getLogout);

    //sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
    Router.post('/login', passport.authenticate('local'), postLogin);
    //sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
    Router.post('/register', postRegister);

    Router.post('/forgot', postForgot);
    Router.get('/check-token/:token', getCheckTokenByToken);
    Router.post('/reset-password/:token', postResetPasswordByToken);

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
            return res.sendStatus(400);
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

    function postForgot(req, res, next) {
        //http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
        var token;

        crypto
            .randomBytesAsync(20)
            .then(generateToken)
            .then(findAccount)
            .then(saveToken)
            .then(function (account) {
                req.session.emailToken = token;
                return res.status(200).send({token: token, mail: account.usermail});
            })
            .catch(function (err) {
                console.log("Can't reset password: ", err);
                return res.sendStatus(err.status || 500);
            });

        function generateToken(buf) {
            token = buf.toString('hex');
            return null;
        }

        function findAccount() {
            if (req.body.forgotMail) {
                return Account.findOne({usermail: req.body.forgotMail});
            } else if (req.body.forgotName) {
                return Account.findOne({username: req.body.forgotName});
            } else {
                var err = new Error();
                err.status = 400;
                throw err;
            }
        }

        function saveToken(account) {
            if (!account) {
                var err = new Error();
                err.status = 404;
                throw err;
            }
            account.resetPasswordToken = token;
            account.resetPasswordExpires = Date.now() + 1000 * 3600 * 24; // 24 hours
            return account.save()
        }
    }

    function getCheckTokenByToken(req, res) {
        Account
            .findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {$gt: Date.now()}
            })
            .then(function (account) {
                if (!account) {
                    return res.sendStatus(404);
                }
                return res.sendStatus(200)
            })
            .catch(function (err) {
                return res.sendStatus(500);
            });
    }

    function postResetPasswordByToken(req, res) {
        if (!req.body.password) {
            return res.sendStatus(400);
        }

        Account
            .findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {$gt: Date.now()}
            })
            .then(function (account) {
                if (!account) {
                    var err = new Error();
                    err.status = 404;
                    throw err;
                }
                account.password = req.body.password;
                account.resetPasswordToken = undefined;
                account.resetPasswordExpires = undefined;
                return account.save();
            })
            .then(function(){
                return res.sendStatus(200);
            })
            .catch(function (err) {
                console.log('Error resetting password: ', err);
                return res.sendStatus(err.status || 500);
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
