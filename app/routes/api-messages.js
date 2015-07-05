module.exports = function (express, Message, Account) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');

    // DECLARATION

    Router.post('/', postMessage);
    Router.post('/search/user/:user/groups/:groups', postMessagesSearchByUserAndRoles);

    return Router;

    // IMPLEMENTATION

    function postMessage(req, res) {
        if (req.isAuthenticated()) {

            console.log(req.body);

            var message = req.body.params.message;
            if (!message) {
               return res.status(400).json({status: 'error', message: "Bad request!"}); 
            }
            console.log(message);

            Message.create(message, function (err) {
                if (err) {
                    console.log('Error creating message! ' + err);
                    res.status(500).json({status: 'error', message: err});
                }
                else {
                    res.status(201).json({ status: 'success' });
                }
            });

        } else {
            res.status(403).send('forbidden').end();
        }
    }

    function postMessagesSearchByUserAndRoles(req, res) {
        if (req.isAuthenticated()) {
            var user = req.params.user;
            var groups = req.params.groups;
            if (groups && !Array.isArray.groups) {
                groups = [groups];
            }

            var conditions;
            var condUser = { toUser: user };
            var condGroup = { toGroup: { $in: groups } };

            if (!user && !groups) {
                return res.status(400).json({ status: 'error', message: 'Bad request!' });
            }
            if (user && groups) {
                conditions = { $or: [condUser, condGroup] };
            } else if (!user){
                conditions = condGroup;
            } else if (!groups) {
                conditions = condUser;
            };
            
            console.log(conditions);

            Message.find(conditions, function(err, messages){
                if (err) {
                    console.log('Error creating message! ' + err);
                    res.status(400).json({status: 'error', message: err});
                }

                res.status(200).json(messages);
            });

        } else {
            res.status(403).send('forbidden').end();
        }

    }

};