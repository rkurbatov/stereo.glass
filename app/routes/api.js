module.exports = function (app, express, mongoose, Account) {
    'use strict';

    var Router = express.Router();
    var Category = require('../models/category')(mongoose);
    var Layout = require('../models/layout')(mongoose);


    Router.get('/users', function (req, res) {
        
        var findObj = {};

        if (req.isAuthenticated()) {
            
            if (req.query.roles) {
                findObj.role = { $in: JSON.parse(req.query.roles) }
            }    

            Account.find(findObj, '_id username usermail role createdAt activeAt', function (err, users) {
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

    Router.put('/users/:id', function (req, res) {
        // only admin can modify users (or user itself)
        if (req.isAuthenticated() && (req.user.role === 'admin' || req.user['_id'] === req.params.id)) {
                Account.findById(req.params.id).exec(function(err, acc){
                    if (req.body.username) acc.username = req.body.username;
                    if (req.body.usermail) acc.usermail = req.body.usermail;
                    if (req.body.role) acc.role = req.body.role;
                    acc.save();
                    if (req.body.password) {
                        acc.setPassword(req.body.password, function(err){
                            if (err) {
                                console.log("Cant't change user password: ", err);
                            } else {
                                acc.save();
                                res.status(200).json({success: 'user with password is modified'});
                            }    

                        })
                    } else res.status(200).json({success: 'user is modified'});
                });
        } else {
            res.status(403).send('forbidden').end();    
        }   
    });

    Router.delete('/users', function (req, res) {
        if (req.isAuthenticated() && req.user.role === 'admin') {
            if (req.query['_id']) {
                Account.findOneAndRemove({'_id': req.query['_id']}, function(err, data){
                    if (err) console.log(err);
                    if (data) { 
                        res.status(200).send({success: data.username + ' is deleted'});
                    } else {
                        res.status(404).send({ error: 'entry not found'});
                    };
                });
            } else {
                res.status(400).send('bad request');
            }
        } else {
            res.status(403).send('forbidden').end();    
        }    
    });

    Router.get('/layouts', function (req, res) {
        var sel, findObj = {}, tmpArr = [], tmpDateQueryObj = {};


        if (req.isAuthenticated()) {
            if (req.query.selection) {
                sel = JSON.parse(req.query.selection);

                if (sel.catColors && sel.catColors.length > 0) {
                    tmpArr.push({catColors : {$in : sel.catColors}});
                }

                if (sel.catAssortment && sel.catAssortment.length > 0) {
                    tmpArr.push({catAssortment : {$in : sel.catAssortment}});
                }

                if (sel.catCountries && sel.catCountries.length > 0) {
                    tmpArr.push({catCountries : {$in : sel.catCountries}});
                }

                if (sel.designers && sel.designers.length > 0) {
                    tmpArr.push({createdBy : { $in : sel.designers }});
                }

                if (sel.fromDate || sel.ToDate) {
                    if (sel.fromDate) tmpDateQueryObj.$gte = sel.fromDate;
                    if (sel.toDate) tmpDateQueryObj.$lt = sel.toDate;
                    tmpArr.push({createdAt: tmpDateQueryObj});
                }                

                if (tmpArr.length > 0) {
                    findObj = {$and: tmpArr};
                }
            }

            Layout.find(findObj, '', function (err, layouts) {
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

    Router.delete('/layouts', function (req, res) {
        if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'designer')) {
            if (req.query['_id']) {
                Layout.findOneAndRemove({'_id': req.query['_id']}, function(err, data){
                    if (err) console.log(err);
                    if (data) { 
                        res.status(200).send({success: data.name + ' is deleted'});
                    } else {
                        res.status(404).send({ error: 'entry not found'});
                    };
                });
            } else {
                res.status(400).send('bad request');
            }
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
