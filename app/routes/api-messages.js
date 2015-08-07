module.exports = function (express, Message) {
    'use strict';

    var Router = express.Router();

    // DECLARATION

    Router.post('/', postMessage);
    Router.post('/search/user/:user/groups/:groups', postMessagesSearchByUserAndRoles);

    return Router;

    // IMPLEMENTATION

    function postMessage(req, res) {
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        var message = req.body.params.message;
        if (!message) {
            return res.sendStatus(400);
        }

        Message
            .create(message)
            .then(function () {
                return res.sendStatus(201);
            })
            .catch(function (err) {
                console.log('Error creating message! ' + err);
                return res.sendStatus(500);
            });
    }

    function postMessagesSearchByUserAndRoles(req, res) {
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        var user = req.params.user;
        var groups = req.params.groups;
        if (!user && !groups) {
            return res.sendStatus(400);
        }

        if (groups && !Array.isArray.groups) {
            groups = [groups];
        }

        var conditions;
        var condUser = {toUser: user};
        var condGroup = {toGroup: {$in: groups}};

        if (user && groups) {
            conditions = {$or: [condUser, condGroup]};
        } else if (!user) {
            conditions = condGroup;
        } else if (!groups) {
            conditions = condUser;
        }

        Message
            .find(conditions)
            .then(function (messages) {
                return res.json(messages);
            })
            .catch(function (err) {
                console.log('Error creating message! ' + err);
                return res.sendStatus(500);
            });
    }

};