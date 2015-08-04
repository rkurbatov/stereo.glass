'use strict';

var APP_PORT = process.env.APP_PORT;

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var mailer = require('express-mailer');

var app = express();

// ============ CONFIGURE EXPRESS ============

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

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
var Account = require('./app/models/account')(mongoose);
var Category = require('./app/models/category')(mongoose);
var Layout = require('./app/models/layout')(mongoose);
var Message = require('./app/models/message')(mongoose);

// ========= STATIC partials route ==============
// NB! Need to be used BEFORE session code
app.use('/', require('./app/routes/static')(express));

// ===== Passport and sessions =====
var configSession = require('./app/config/session')(session);
var helperSession = require('./app/helpers/session');

app.use(session(configSession));
app.use(helperSession.persistCookies);
// Session-persisted message middleware
app.use(helperSession.persistLocals);

var helperPassport = require('./app/helpers/passport')(app, APP_PORT, passport, Account);
helperPassport.init();

// ======== FILES AND VIEWS ========

app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');
app.set('views', './app/views');

// ======== MULTER =========
require('./app/helpers/uploader')(app);

// ======== MAILER =========
var configMailer = require('./app/config/mailer');
mailer.extend(app, configMailer);

// ======== ROUTES ========
app.use('/', require('./app/routes/base')(express, Account));
app.use('/auth', require('./app/routes/auth')(express, passport, Account));
app.use('/api/users', require('./app/routes/api-users')(express, Account, Layout));
app.use('/api/categories', require('./app/routes/api-categories')(express, Category));
app.use('/api/layouts', require('./app/routes/api-layouts')(express, Layout));
app.use('/api/files', require('./app/routes/api-files')(express));
app.use('/api/messages', require('./app/routes/api-messages')(express, Message));
app.use('/api/mail', require('./app/routes/api-mail')(express, app.mailer));

// ======== START APP ========
app.listen(APP_PORT, 'localhost', function () {
    console.log('Listening on port ' + APP_PORT + ' ...');
});

// exports app
module.exports = app;