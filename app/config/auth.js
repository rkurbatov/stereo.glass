module.exports = function (APP_PORT) {
    var configAuth = {};

    configAuth.facebook = {
        clientID: '1009423969070500',
        clientSecret: 'fb4aa53026edd5daf613ed51c3992125',
        callbackURL: 'http://localhost:' + APP_PORT + '/auth/facebook/callback'
    };

    configAuth.twitter = {
        consumerKey: 'sW7cE7pAk3jm00e81tqKjksnW',
        consumerSecret: 'FzHH1X07aEwZ5Zi9cgba31H0N8s99Al2wLOoyo7qeQSHW78IeT',
        callbackURL: 'http://localhost:' + APP_PORT + '/auth/twitter/callback'
    };

    return configAuth;
};