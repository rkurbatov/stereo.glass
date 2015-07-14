module.exports = function (express, Layout) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');
    var Promise = require('bluebird');
    var mv = Promise.promisify(require('mv'));
    var UploadRoot = __dirname + '/../../uploads/';

    // DECLARATION

    // Creates layout
    // uses req.body.params.layout for new layout
    Router.post('/', postLayouts);
    Router.post('/search/name/:name', postSearchByName);

    // Posts comment to given layout
    Router.post('/comment/:id', postCommentById);

    Router.get('/', getLayouts);
    Router.get('/:id', getLayoutsById);

    // Updates layout
    // uses req.body.params.setObject to update and 
    // req.body.params.unsetArray to remove db record values
    Router.put('/:id', putLayoutsById);
    // Adds rating of current user and updated average to layout
    Router.put('/:id/rating/:value', putLayoutsByIdRatingByValue);
    // Deletes rating of current user in selected layout
    Router.delete('/:id/rating', deleteLayoutsByIdRating);


    Router.delete('/:id', deleteLayoutsById); // only marks layout as deleted
    Router.delete('/:id/completely', getLayoutsByIdCompletely);

    return Router;

    // IMPLEMENTATION

    function getLayouts(req, res) {
        var sel, findObj = {}, tmpArr = [], tmpDateQueryObj = {};

        if (req.isAuthenticated()) {
            if (req.query.selection) {
                sel = JSON.parse(req.query.selection);

                if (sel.colors && sel.colors.length > 0) {
                    tmpArr.push({catColors: {$in: sel.colors}});
                }

                if (sel.assortment && sel.assortment.length > 0) {
                    tmpArr.push({catAssortment: {$in: sel.assortment}});
                }

                if (sel.countries && sel.countries.length > 0) {
                    tmpArr.push({catCountries: {$in: sel.countries}});
                }

                if (sel.plots && sel.plots.length > 0) {
                    tmpArr.push({catPlots: {$in: sel.plots}});
                }

                if (sel.authors && sel.authors.length > 0) {
                    tmpArr.push({createdBy: {$in: sel.authors}});
                }

                if (sel.startDate || sel.endDate) {
                    if (sel.startDate) {
                        tmpDateQueryObj.$gte = sel.startDate;
                    }
                    if (sel.endDate) {
                        tmpDateQueryObj.$lt = sel.endDate;
                    }
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
                    res.send(JSON.stringify(layouts));
                }
            });
        } else {
            res.status(403).send('forbidden').end();
        }

    }

    function deleteLayoutsById(req, res) {
        if (req.isAuthenticated() && _.contains(['admin', 'designer', 'founder', 'curator'], req.user.role)) {
            Layout.findOne({'_id': req.params.id}, function (err, layout) {
                if (err) {
                    console.log('Error removing layout: ', err);
                    return res.status(500).send('Error removing layout: ' + err);
                }
                if (layout) {
                    layout.isHidden = true;
                    layout.save(function (err) {
                        if (err) {
                            console.log('Error removing layout: ', err);
                            return res.status(500).send('Error removing layout: ' + err);
                        } else {
                            return res.status(204).send({success: layout.name + ' is marked as deleted'});
                        }
                    });
                } else {
                    return res.status(404).send({error: 'entry not found'});
                }
            });
        } else {
            return res.status(403).send('forbidden');
        }
    }

    function getLayoutsByIdCompletely(req, res) {
        if (req.isAuthenticated() && _.contains(['admin'], req.user.role)) {
            Layout.findOneAndRemove({'_id': req.params.id}, function (err, data) {
                if (err) {
                    console.log('Error removing layout: ', err);
                    return res.status(500).end();
                }
                if (data) {
                    res.status(204).send({success: data.name + ' is deleted'});
                } else {
                    res.status(404).send({error: 'entry not found'});
                }
            });
        } else {
            res.status(403).send('forbidden');
        }
    }

    function getLayoutsById(req, res) {
        if (req.isAuthenticated()) {
            Layout.findById({_id: req.params.id}, '-_id', function (err, doc) {
                if (err) {
                    console.log(err);
                    res.status(500).end(); // Server error
                } else if (doc) {
                    res.json(doc);
                } else {
                    res.status(404).end(); // Not found
                }
            });
        } else {
            res.status(403).send('forbidden').end();
        }
    }

    function postLayouts(req, res) {
        if (req.isAuthenticated()) {

            var data = JSON.parse(req.body.data);
            data.createdBy = req.user.username;

            Layout.create(data, function (err) {
                if (err) {
                    console.log('Ошибка при создании макета! ' + err);
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

    function putLayoutsById(req, res) {
        if (req.isAuthenticated()) {

            var setObject = req.body.params.setObject;
            var unsetArray = req.body.params.unsetArray;
            if (!setObject && !unsetArray) {
                return res.status(400).json({status: 'error', message: 'Bad request'});
            }

            var layoutQuery = Layout.findById(req.params.id).exec();

            layoutQuery
                .then(function (layout) {
                    if (setObject.status === 'assigned' && !layout.reference) {
                        console.log("I need to make ref query");
                        var referenceQuery = Layout
                            .find({}, "-_id reference")
                            .exists("reference")
                            .sort("-reference")
                            .limit(1)
                            .exec();

                        return referenceQuery
                            .then(function (result) {
                                if (result.length === 0) {
                                    layout.reference = 1;
                                } else {
                                    layout.reference = result[0].reference + 1;
                                }

                                console.log("reference is: ", layout.reference);

                                var refDir = _.padLeft(layout.reference, 5, '0');
                                var fromDir = UploadRoot + 'pictures/' + layout.urlDir + '/';
                                var toDir = UploadRoot + 'ready/' + refDir + '/';

                                return mv(fromDir + layout.urlThumb, toDir + layout.urlThumb, {mkdirp: true})
                                    .then(function () {
                                        console.log('moved thumb');
                                        return mv(fromDir + layout.url2d, toDir + layout.url2d, {mkdirp: true});
                                    })
                                    .then(function () {
                                        console.log('moved url');
                                        layout.urlDir = refDir;
                                        return layout;
                                    }).catch(function (err) {
                                        throw new Error("Cant'move file! " + err)
                                    });
                            });

                    } else {
                        return layout;
                    }
                })
                .then(function (layout) {
                    _.each(setObject, function (value, key) {
                        if (key !== 'reference') {
                            layout[key] = value;
                        }
                    });

                    _.each(unsetArray, function (key) {
                        layout[key] = undefined;
                    });

                    layout.save();
                    return res.status(200).json({status: 'success', layout: layout});

                })
                .then(null, function (err) {
                    console.log('Макет не найден! ' + err);
                    res.status(404).json({status: 'error', message: err});
                });


        } else {
            res.status(403).send('forbidden').end();
        }
    }

    function putLayoutsByIdRatingByValue(req, res) {
        if (req.isAuthenticated()) {

            console.log(req.params);

            Layout.findById({'_id': req.params.id}, function (err, found) {
                if (err) {
                    console.log("Error adding new rating", err);
                    return res.status(500).send('server error').end();
                }

                if (!found) return res.status(404).send('rating not found').end();

                var idx = _.findIndex(found.ratings, {assignedBy: req.user.username});

                if (idx > -1) {
                    found.ratings[idx].value = req.params.value;
                } else {
                    found.ratings.push({value: req.params.value, assignedBy: req.user.username});
                }

                found.save(function (err) {
                    if (err) {
                        console.log("Error adding new rating", err);
                        return res.status(500).send('server error').end();
                    }
                    else return res.status(200).json({status: 'ok'}).end();
                })
            })

        } else {
            res.status(403).send('forbidden').end();
        }

    }

    function deleteLayoutsByIdRating(req, res) {
        if (req.isAuthenticated()) {

            Layout.findById({'_id': req.params.id}, function (err, found) {
                if (err) {
                    console.log("Error removing rating", err);
                    return res.status(500).send('server error').end();
                }

                if (!found) return res.status(404).send('rating not found').end();

                var idx = _.findIndex(found.ratings, {assignedBy: req.user.username});

                if (idx > -1) {
                    found.ratings.splice(idx, 1);
                }

                found.save(function (err) {
                    if (err) {
                        console.log("Error removing rating", err);
                        return res.status(500).json({status: 'server error'}).end();
                    }
                    else return res.status(204).json({status: 'ok'}).end();
                })
            })

        } else {
            res.status(403).send('forbidden');
        }
    }

    function postSearchByName(req, res) {
        if (req.isAuthenticated()) {
            Layout.findOne({name: req.params.name}, '-_id', function (err, layout) {
                if (err) {
                    console.log(err);
                    res.status(500).end(); // Server error
                } else if (layout) {
                    res.status(200).end();
                } else {
                    res.status(204).end(); // No content - 204 to supress errors!!!
                }
            });
        } else {
            res.status(403).send('forbidden').end();
        }
    }

    function postCommentById(req, res) {
        if (req.isAuthenticated()) {
            var layoutQuery = Layout.findById(req.params.id).exec();

            layoutQuery
                .then(function (layout) {
                    var validQuery = req.body.params
                        && req.body.params.postedBy
                        && req.body.params.postedAt
                        && req.body.params.text;

                    if (!validQuery) {
                        throw Error('Invalid post comment query!')
                    }

                    layout.comments.push(req.body.params);
                    layout.save();
                    return res.status(200).send({status: 'success'});
                })
                .then(null, function (err) {
                    console.log('Error posting comment: ', err);
                    return res.status(500).send({status: 'server error', message: err});
                });
        } else {
            return res.status(403).send('forbidden');
        }
    }

};
