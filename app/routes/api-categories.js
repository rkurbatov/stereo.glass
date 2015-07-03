module.exports = function (express, Category) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');

    // DECLARATION

    Router.get('/:name', getCategoriesByName);

    return Router;

    // IMPLEMENTATION

    function getCategoriesByName(req, res) {
        if (req.isAuthenticated() && req.params.name) {
            Category.find({catName: req.params.name},
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
            res.status(403).send('forbidden');
        }
    }
};