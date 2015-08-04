module.exports = function (session) {
    var MongoStore = require('connect-mongo')(session);

    return {
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30    // one month
        }, // 60 min
        secret: 'barmgalot',
        saveUninitialized: false,
        resave: true,
        store: new MongoStore({
            db: process.env.NODE_ENV === 'production'
                ? 'stereo_glass'
                : 'dev_stereo_glass',
            host: 'localhost',
            collection: 'sessions',
            autoReconnect: true
        })
    };
};

