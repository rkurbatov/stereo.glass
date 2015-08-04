module.exports = function (session, mongoose) {
    var MongoStore = require('connect-mongo')(session);

    return {
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30    // one month
        },
        secret: 'barmgalot',
        saveUninitialized: false,
        resave: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    };
};

