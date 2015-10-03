module.exports = (APP_PORT) => {

    var express = require('express');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var session = require('express-session');
    var passport = require('passport');
    var mongoose = require('mongoose');
    var mailer = require('express-mailer');
    var multer = require('multer');
    var favicon = require('serve-favicon');

    var Promise = require('bluebird');
    Promise.promisifyAll(mongoose);

    var crypto = require('crypto');
    Promise.promisifyAll(crypto);

    var app = express();

    // ============ CONFIGURE EXPRESS ============

    app.use(favicon(__dirname + './../public/favicon.ico'));

    // get all data/stuff of the body (POST) parameters
    // parse application/json
    app.use(bodyParser.json());

    // parse application/vnd.api+json as json
    //app.use(bodyParser.json({type: 'application/vnd.api+json'}));

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: true}));

    // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(methodOverride('X-HTTP-Method-Override'));

    // ======== DATABASE ========
    var dbName = 'mongodb://localhost/' + (process.env.NODE_ENV === 'production'
            ? 'stereo_glass'
            : 'dev_stereo_glass');
    mongoose.connect(dbName, function (err) {
        if (err) {
            console.log('Connection error: ', err);
            process.exit(1);
        }
    });

    // ============== MODELS =======================
    var Account = require('./models/account')(mongoose);
    var CategoryModel = require('./models/category')(mongoose);
    var Category = CategoryModel.Category;
    var CatLeaf = CategoryModel.CatLeaf;
    var Layout = require('./models/layout')(mongoose);
    var Message = require('./models/message')(mongoose);
    var Language = require('./models/language')(mongoose);

    // ======== FILES AND VIEWS ========
    app.engine('jade', require('jade').__express);
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');
    // NB! Need to be used BEFORE session code
    app.use('/', require('./routes/static')(express));

    // ======== MULTER =========
    var uploader = require('./helpers/uploader')(multer, Promise);

    // ======== MAILER =========
    var configMailer = require('./config/mailer');
    mailer.extend(app, configMailer);

    // ===== Passport and sessions =====
    var configSession = require('./config/session')(session, mongoose);
    app.use(session(configSession));
    var helperPassport = require('./helpers/passport')(app, APP_PORT, passport, Account);
    helperPassport.init();
    var helperSession = require('./helpers/session');
    // Session-persisted message middleware
    app.use(helperSession.persistLocals);
    // Persistent cookies. NB! Should be placed only after passport init!
    app.use(helperSession.persistCookies);

    // ======== ROUTES ========
    app.use('/', require('./routes/base')(express, Account));
    app.use('/auth', require('./routes/auth')(express, passport, crypto, Account));
    app.use('/api/users', require('./routes/api/users')(express, Account, Layout));
    app.use('/api/categories', require('./routes/api/categories')(express, Category));
    app.use('/api/layouts', require('./routes/api/layouts')(express, Layout, Promise));
    app.use('/api/goods', require('./routes/api/goods')(express, Layout));
    app.use('/api/files', require('./routes/api/files')(express, uploader, Layout));
    app.use('/api/messages', require('./routes/api/messages')(express, Message));
    app.use('/api/mail', require('./routes/api/mail')(express, app.mailer));
    app.use('/api/lang', require('./routes/api/lang')(express, Promise, Language, CatLeaf));

    return app;
};
