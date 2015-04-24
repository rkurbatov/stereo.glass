'use strict';

var APP_PORT = 4100;

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
app.use(cookieParser());

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));   //NB! was true

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(session({
    cookie: {maxAge: 1000 * 60 * 60}, // 60 min
    secret: 'barmgalot',
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        db: 'stereo_glass',
        host: 'localhost',
        //port: 10065,
        //username: 'cm',
        //password: 'cm',
        collection: 'session',
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
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


// ======== FILES AND VIEWS ========
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
//app.use(favicon(__dirname + '/pabulic/favicon.ico'));

app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');
app.set('views', './app/views');

// ======== DATABASE ========
// Mongoose
mongoose.connect('mongodb://localhost/stereo_glass');

// ======== ROUTES ========
//require('./app/routes')(app, passport, Account); // configure our routes
app.use('/', require('./app/routes/base')(express, Account));
app.use('/auth', require('./app/routes/auth')(express, passport, Account));
app.use('/api', require('./app/routes/api')(app, express, mongoose, Account));

// ======== START APP ========
app.listen(APP_PORT, 'localhost', function () {
    console.log('Listening on port ' + APP_PORT + ' ...');
});

// exports app
module.exports = app;