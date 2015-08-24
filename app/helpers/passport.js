module.exports = function helperPassport(app, APP_PORT, passport, Account) {

    var TwitterStrategy = require('passport-twitter').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var configAuth = require('../config/auth')(APP_PORT);

    return {
        init
    };

    function init() {
        passport.use(Account.createStrategy());

        passport.use(new TwitterStrategy(configAuth.twitter,
            (token, tokenSecret, profile, done)=> {
                process.nextTick(()=> done(null, profile));
            }));

        passport.use(new FacebookStrategy(configAuth.facebook,
            (accessToken, refreshToken, profile, done)=> {
                // asynchronous verification, for effect...
                process.nextTick(()=> done(null, profile));
            }
        ));

        passport.serializeUser(Account.serializeUser());
        passport.deserializeUser(Account.deserializeUser());

        app.use(passport.initialize());
        app.use(passport.session());
    }

};