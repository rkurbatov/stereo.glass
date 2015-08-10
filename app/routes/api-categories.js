module.exports = function (express, Category) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');

    // DECLARATION

    Router.get('/:name', getCategoriesByName);

    return Router;

    // IMPLEMENTATION

    function getCategoriesByName(req, res) {
        if (!req.isAuthenticated() || !req.params.name) {
            return res.sendStatus(403);
        }

        Category.find({catName: req.params.name},
            '-_id -__v -catName')
            .populate('leaves', '-_id -__v')
            .then(function (result) {
                return res.json(result);
            })
            .catch(function(err){
                console.log(err);
                return res.sendStatus(500);
            });
    }
};