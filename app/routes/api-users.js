module.exports = function (express, Account, Layout) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');

    // DECLARATION

    Router.get('/', getUsers);
    Router.get('/authors', getUsersAuthors);

    Router.put('/:id', putUsersById);

    Router.delete('/:id', deleteUsersById);

    return Router;

    // IMPLEMENTATION

    function getUsers(req, res) {

        var findObj = {};

        if (req.isAuthenticated()) {


            if (req.query.roles) {
                findObj.role = {
                    $in: Array.isArray(req.query.roles) // $in receives only arrays
                        ? req.query.roles
                        : [req.query.roles]
                }
            }
            Account.find(findObj, '_id username usermail role createdAt activeAt', function (err, users) {
                if (err) {
                    console.log(err);
                    res.status(500).end();
                }
                else {
                    res.status(200).send(JSON.stringify(users));
                }
            });

        } else {
            res.status(403).send('forbidden').end();
        }
    }

    // Get all authors of layouts (aggregate using createdBy field)
    function getUsersAuthors(req, res) {
        if (req.isAuthenticated()) {
            Layout.aggregate({$group: {'_id': '$createdBy'}}, function (err, authors) {
                if (err) {
                    console.log('Error aggregating users: ', err);
                    res.status(500).end();
                } else {
                    res.status(200).json(authors);
                }
            });
        } else {
            res.status(403).send('forbidden');
        }
    }

    function putUsersById(req, res) {

        // only admin can modify users (or user itself)
        if (req.isAuthenticated() && (req.user.role === 'admin' || req.user['_id'] === req.params.id)) {

            var setObject = req.body.params.setObject;

            Account.findById(req.params.id).exec(function (err, user) {
                
                if (err) {
                    console.log('User not found! ', err);
                    return res.status('404').json({ status: 'User not found' });
                }

                user.username = setObject.username;
                user.usermail = setObject.usermail;
                user.role = setObject.role;

                // !!! Saving needed before password change. 
                user.save();

                if (setObject.password) {
                    user.setPassword(setObject.password, function (err) {
                        if (err) {
                            console.log("Can't change user password: ", err);
                            return res.status(500).json({ status: 'server error', message: err });
                        } else {
                            user.save();
                        }
                    })
                } 

                res.status(200).json({ success: 'user is modified' });
            });
        } else {
            res.status(403).send('forbidden');
        }
    }

    function deleteUsersById(req, res) {
        if (req.isAuthenticated() && req.user.role === 'admin') {
            Account.findOneAndRemove({'_id': req.params.id}, function (err, data) {
                if (err) console.log(err);
                if (data) {
                    res.status(200).send({success: data.username + ' is deleted'});
                } else {
                    res.status(404).send({error: 'entry not found'});
                }
            });
        } else {
            res.status(403).send('forbidden').end();
        }
    }

};
