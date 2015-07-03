module.exports = function (express, Message, Account) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');

    // DECLARATION

    Router.post('/', postMessage);
    Router.post('/search/name/:name/roles/:roles', postMessagesSearch);


    return Router;

    // IMPLEMENTATION

    function postMessage(req, res) {
        if (req.isAuthenticated()) {

            var data = JSON.parse(req.body.data);

            Message.create(data, function (err) {
                if (err) {
                    console.log('Error creating message! ' + err);
                    res.status(400).json({status: 'error', message: err});
                }
                else {
                    res.status(201).json({status: 'success'});
                }
            });

        } else {
            res.status(403).send('forbidden').end();
        }
    }

    function postMessagesSearch(req, res) {

    }

};