'use strict';

var APP_PORT = process.env.APP_PORT;

var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
//var favicon = require('express-favicon');

var app = express();

// ============ CONFIGURE EXPRESS ============
//app.use(logger('combined'));
// cookieParser no more needed to parse cookies
//app.use(cookieParser());

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(session({
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
}));

app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});

var Account = require('./app/models/account')(mongoose);
//passport.use(new LocalStrategy(Account.authenticate()));
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use(function (req, res, next) {

    // set usermail cookie to response
    if (req.user) {
        if (req.user.usermail) res.cookie('usermail', req.user.usermail);
        if (req.user.username) res.cookie('username', req.user.username);
        res.cookie('userrole', req.user.role);
    }

    // set locals user variable
    res.locals.user = req.user;
    next();
});

// ======== FILES AND VIEWS ========
// set the static files location /public/img will be /img for users
//app.use(express.static(__dirname + '/public'));
//app.use('/uploads', express.static(__dirname + '/uploads'));
//app.use(favicon(__dirname + '/pabulic/favicon.ico'));

app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');
app.set('views', './app/views');

// ======== DATABASE ========
// Mongoose
var dbName = 'mongodb://localhost/' + (process.env.NODE_ENV === 'production'
    ? 'stereo_glass'
    : 'dev_stereo_glass');
mongoose.connect(dbName, function(err) {
    console.log('Connection error: ', err);
    process.exit(1);
});

// ======== MULTER =========
require('./app/helpers/uploader')(app);

// ======== ROUTES ========
app.use('/', require('./app/routes/base')(express, Account));
app.use('/auth', require('./app/routes/auth')(express, passport, Account));
app.use('/api', require('./app/routes/api')(app, express, mongoose, Account));

// ======== START APP ========
app.listen(APP_PORT, 'localhost', function () {
    console.log('Listening on port ' + APP_PORT + ' ...');
});

// exports app
module.exports = app;