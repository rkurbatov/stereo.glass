// Use Babel to handle all es files
'use strict';
require("babel/register");

var APP_PORT = process.env.APP_PORT;
var app = require("./app/init")(APP_PORT);

// ======== START APP ========
app.listen(APP_PORT, 'localhost', function () {
    console.log('Listening on port ' + APP_PORT + ' ...');
});