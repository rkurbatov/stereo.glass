module.exports = function (express, Layout) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');

    // DECLARATION

    Router.post('/', postLayouts);
    Router.post('/search/name/:name', postSearchByName);

    Router.get('/', getLayouts);
    Router.get('/:id', getLayoutsById);

    // Updates layout
    Router.put('/', putLayouts);
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

                if (sel.fromDate || sel.toDate) {
                    if (sel.fromDate) {
                        tmpDateQueryObj.$gte = sel.fromDate;
                    }
                    if (sel.toDate) {
                        tmpDateQueryObj.$lt = sel.toDate;
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
        if (req.isAuthenticated() && _.contains(['admin', 'designer', 'founder'], req.user.role)) {
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

    function putLayouts(req, res) {
        if (req.isAuthenticated()) {
            var data = JSON.parse(req.body.data);

            Layout.create(data, function (err) {
                if (err) {
                    console.log('Ошибка при сохранении макета! ' + err);
                    res.status(400).json({status: 'error', message: err});
                }
                else {
                    res.status(200).json({status: 'success'});
                }
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

};
