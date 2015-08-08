module.exports = function (express, Account, Layout) {
    'use strict';

    var Router = express.Router();

    // DECLARATION

    Router.get('/', getUsers);
    Router.get('/authors', getUsersAuthors);

    Router.put('/:id', putUsersById);

    Router.delete('/:id', deleteUsersById);

    return Router;

    // IMPLEMENTATION

    function getUsers(req, res) {

        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        var findObj = {};

        if (req.query.roles) {
            findObj.role = {
                $in: Array.isArray(req.query.roles) // $in receives only arrays
                    ? req.query.roles
                    : [req.query.roles]
            }
        }
        Account
            .find(findObj, '-password')
            .then(function (users) {
                return res.json(users);
            })
            .catch(function (err) {
                console.log("Cant't find account: ", err);
                return res.sendStatus(500);
            });
    }

    // Get all authors of layouts (aggregate using createdBy field)
    function getUsersAuthors(req, res) {
        if (req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        Layout
            .aggregate({$group: {'_id': '$createdBy'}})
            .then(function (authors) {
                return res.json(authors);
            })
            .catch(function (err) {
                console.log('Error aggregating users: ', err);
                res.sendStatus(500);
            });
    }

    function putUsersById(req, res) {

        // only admin can modify users (or user itself)
        if (!req.isAuthenticated()
            || (req.user.role !== 'admin' && req.user['_id'] !== req.params.id)) {
            return res.sendStatus(403);
        }

        var setObject = req.body.params.setObject;
        var user;

        Account
            .findById(req.params.id)
            .then(function (result) {
                if (!result) {
                    return res.sendStatus(404);
                }

                user = result;
                user.username = setObject.username;
                user.usermail = setObject.usermail;
                user.role = setObject.role;
                if (setObject.borderColor) {
                    user.borderColor = setObject.borderColor;
                }

                // !!! Saving needed before password change.
                return user.save();
            })
            .then(function(){
                if (setObject.password) {
                    user.setPassword(setObject.password, function (err) {
                        if (err) {
                            console.log("Can't change user password: ", err);
                            return res.sendStatus(500);
                        } else {
                            return user.save();
                        }
                    })
                }
                return res.sendStatus(200);
            })
            .then(function(){
                return res.sendStatus(200);
            })
            .catch(function (err) {
                console.log('Error modifying user: ', err);
                return res.sendStatus(500);
            });

    }

    function deleteUsersById(req, res) {
        if (!req.isAuthenticated() || req.user.role !== 'admin') {
            return res.sendStatus(403);
        }

        Account
            .findOneAndRemove({'_id': req.params.id})
            .then(function (user) {
                if (!user) {
                    return res.sendStatus(404);
                }
                return res.sendStatus(204);
            })
            .catch(function (err) {
                console.log("Cant't remove account: ", err);
                return res.sendStatus(403);
            });

    }

};
