module.exports = function (express, Layout, Promise) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');
    var mv = Promise.promisify(require('mv'));
    var UploadRoot = __dirname + '/../../../uploads/';

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
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        var sel, findObj = {}, tmpArr = [], tmpDateQueryObj = {};

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

        Layout
            .find(findObj, '')
            .then((layouts)=> res.json(layouts))
            .catch((err)=> {
                console.log('Cant\'t find layouts: ', err);
                return res.sendStatus(500);
            });

    }

    function deleteLayoutsById(req, res) {
        if (!req.isAuthenticated()
            || _.contains(['admin', 'designer', 'founder', 'curator'], req.user.role)) {
            return res.sendStatus(403);
        }

        Layout
            .findOne({'_id': req.params.id})
            .then((layout)=> {
                if (!layout) {
                    var err = new Error();
                    err.status = 404;
                    throw err;
                }
                layout.isHidden = true;
                layout.save();
                return res.sendStatus(204);
            })
            .catch((err)=> {
                console.log('Error removing layout: ', err);
                return res.sendStatus(err.status || 500);
            });
    }


    function getLayoutsByIdCompletely(req, res) {
        if (!req.isAuthenticated()
            || !_.contains(['admin'], req.user.role)) {
            return res.sendStatus(403);
        }

        Layout
            .findOneAndRemove({'_id': req.params.id})
            .then(()=> data
                ? res.sendStatus(204)
                : res.sendStatus(404))
            .catch((err)=> {
                console.log('Error removing layout: ', err);
                return res.sendStatus(500);
            });
    }

    function getLayoutsById(req, res) {
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        Layout
            .findById({_id: req.params.id}, '-_id')
            .then(function (layout) {
                return layout
                    ? res.json(layout)
                    : res.sendStatus(404);
            })
            .catch(function (err) {
                console.log(err);
                return res.sendStatus(500);
            });
    }

    function postLayouts(req, res) {
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        var layoutData = JSON.parse(req.body.data);
        layoutData.createdBy = req.user.username;

        Layout
            .createAsync(layoutData)
            .then(()=>res.sendStatus(201))
            .catch((err)=> {
                console.log('Error creating layout: ', err);
                return res.sendStatus(500);
            });
    }

    function putLayoutsById(req, res) {
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        var setObject = req.body.params.setObject;
        var unsetArray = req.body.params.unsetArray;
        if (!setObject && !unsetArray) {
            return res.status(400);
        }

        Layout
            .findById(req.params.id)
            .then((layout)=> {
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
                                    err.status = 500;
                                    throw err;
                                });
                        });

                } else {
                    return layout;
                }
            })
            .then((layout)=> {
                _.each(setObject, (value, key)=> {
                    if (key !== 'reference') {
                        layout[key] = value;
                    }
                });

                _.each(unsetArray, (key)=> layout[key] = undefined);

                return layout.save();
            })
            .then((layout)=>res.status(200).json({status: 'success', layout: layout}))
            .catch((err)=> {
                console.log('Макет не найден! ' + err);
                return res.status(err.status || 404);
            });
    }

    function putLayoutsByIdRatingByValue(req, res) {
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        Layout
            .findById({'_id': req.params.id})
            .then((layout)=> {
                if (!layout) {
                    var err = new Error();
                    err.status = 404;
                    throw err;
                }

                var idx = _.findIndex(layout.ratings, {assignedBy: req.user.username});

                if (idx > -1) {
                    layout.ratings[idx].value = req.params.value;
                } else {
                    layout.ratings.push({value: req.params.value, assignedBy: req.user.username});
                }

                return layout.save();
            })
            .then(()=> res.sendStatus(200))
            .catch((err)=> {
                console.log("Error adding new rating", err);
                return res.sendStatus(err.status || 500);
            });
    }

    function deleteLayoutsByIdRating(req, res) {
        if (!req.isAuthenticated()) {
            res.sendStatus(403);
        }

        Layout
            .findById({'_id': req.params.id})
            .then((layout)=> {
                if (!layout) {
                    var err = new Error();
                    err.status = 404;
                    throw err;
                }

                var idx = _.findIndex(layout.ratings, {assignedBy: req.user.username});

                if (idx > -1) {
                    layout.ratings.splice(idx, 1);
                }

                return layout.save();
            })
            .then(()=> res.sendStatus(204))
            .catch((err)=> {
                console.log("Error removing rating", err);
                return res.sendStatus(err.status || 500);
            });
    }

    function postSearchByName(req, res) {
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        Layout
            .findOne({name: req.params.name}, '-_id')
            .then((layout)=> layout
                    ? res.sendStatus(200)
                    : res.sendStatus(204))
            .catch((err)=> {
                console.log("Error searching layout: ", err);
                return res.sendStatus(500);
            });
    }

    function postCommentById(req, res) {
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        var validQuery = req.body.params
            && req.body.params.postedBy
            && req.body.params.postedAt
            && req.body.params.text;

        if (!validQuery) {
            res.sendStatus(400);
        }

        Layout
            .findById(req.params.id)
            .then((layout)=> {
                layout.comments.push(req.body.params);
                return layout.save();
            })
            .then(()=> res.sendStatus(200))
            .catch((err)=> {
                console.log('Error posting comment: ', err);
                return res.sendStatus(500);
            });
    }

};
