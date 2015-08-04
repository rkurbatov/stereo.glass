module.exports = function helperPassport(APP_PORT, passport, Account) {

    var TwitterStrategy = require('passport-twitter').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var configAuth = require('../config/auth')(APP_PORT);

    return {
        init: init
    };

    function init() {
        passport.use(Account.createStrategy());

        passport.use(new TwitterStrategy(configAuth.twitter,
            function (token, tokenSecret, profile, done) {
                process.nextTick(function () {
                    return done(null, profile);
                });
            }));

        passport.use(new FacebookStrategy(configAuth.facebook,
            function (accessToken, refreshToken, profile, done) {
                // asynchronous verification, for effect...
                process.nextTick(function () {
                    return done(null, profile);
                });
            }
        ));

        passport.serializeUser(Account.serializeUser());
        passport.deserializeUser(Account.deserializeUser());
    }

};