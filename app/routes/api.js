module.exports = function (app, express, mongoose, Account) {
    'use strict';

    var Router = express.Router();
    var Category = require('../models/category')(mongoose);
    var Layout = require('../models/layout')(mongoose);


    Router.get('/users', function (req, res) {
        if (req.isAuthenticated()) {
            Account.find({}, '_id username usermail role createdAt activeAt', function (err, users) {
                if (err) {
                    console.log(err);
                    res.status(500).end();
                }
                else {
                    res.send(JSON.stringify(users));
                }
            });
        } else {
            res.status(403).send('forbidden').end();
        }
    });

    Router.get('/layouts', function (req, res) {
        if (req.isAuthenticated()) {
            Layout.find({}, '', function (err, layouts) {
                if (err) {
                    console.log(err);
                    res.status(500).end();
                }
                else {
                    layouts.forEach(function(i, v){

                    });
                    res.send(JSON.stringify(layouts));
                }
            });
        } else {
            res.status(403).send('forbidden').end();
        }

    });

    Router.get('/categories', function (req, res) {
        var catname;

        if (req.isAuthenticated()) {
            catname = req.query.catname;
            Category.find({catName: catname},
                '-_id -__v -catName')
                .populate('leaves', '-_id -__v')
                .exec(function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(500).end();
                    } else {
                        console.log(result);
                        res.json(result);
                    }
                });
        } else {
            res.status(403).send('forbidden').end();
        }
    });

    Router.post('/upload', function (req, res) {
        res.json(res.sgUploader);
    });

    // ***************    LAYOUT     ************************

    Router.get('/layout', function (req, res) {
        if (req.isAuthenticated()) {
            if (req.query.data) {
                Layout.findOne({name: req.query.data}, '-_id', function(err, doc) {
                    if (err) {
                        console.log(err);
                        req.status(500).end(); // Server error
                    } else if (doc) {
                        res.json(doc);
                    } else {
                        res.status(204).end(); // No content
                    }
                });
            } else {
                // Bad request
                res.status(400).end();
            }
        } else {
            res.status(403).send('forbidden').end();
        }
    });

    Router.post('/layout', function (req, res) {
        if (req.isAuthenticated()) {

            var data = JSON.parse(req.body.data);
            data.createdBy = req.user.username;

            Layout.create(data, function (err) {
                if (err) {
                    console.log('Ошибка при сохранении макета! ' + err);
                    res.json({status: 'error', message: err});
                }
                else {
                    res.json({status: 'success'});
                }
            });

        } else {
            res.status(403).send('forbidden').end();
        }

    });

    return Router;
};
