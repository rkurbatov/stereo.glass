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
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        Layout
            .aggregateAsync({$group: {'_id': '$createdBy'}})
            .then(function (authors) {
                return res.json(authors);
            })
            .catch(function (err) {
                console.log('Error aggregating users: ', err);
                res.sendStatus(500);
            });
    }

    function putUsersById(req, res) {

        var setObject = req.body.params.setObject;

        if (!setObject) {
            return res.sendStatus(400);
        }

        if (!req.isAuthenticated()
            || (
                req.user.role !== 'admin'
                && req.user['_id'] !== req.params.id        // only admin can modify users (or user itself)
                && setObject.role                           // only admin can assign roles
            )) {
            return res.sendStatus(403);
        }

        Account
            .findById(req.params.id)
            .then((account)=> {
                if (!account) {
                    var err = new Error();
                    err.status = 404;
                    throw err;
                }

                account.username = setObject.username;
                account.usermail = setObject.usermail;
                account.role = setObject.role;
                if (setObject.borderColor) {
                    account.borderColor = setObject.borderColor;
                }

                if (setObject.assignedLanguage) {
                    account.assignedLanguage = setObject.assignedLanguage;
                }

                if (setObject.password) {
                    account.password = setObject.password;
                }

                return account.save();
            })
            .then(function () {
                return res.sendStatus(200);
            })
            .catch(function (err) {
                console.log('Error modifying user: ', err);
                return res.sendStatus(err.status || 500);
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
                return res.sendStatus(500);
            });

    }

};
