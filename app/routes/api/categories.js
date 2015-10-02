module.exports = function (express, Category) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');

    // DECLARATION

    Router.get('/:name', getCategoriesByName);

    return Router;

    // IMPLEMENTATION

    function getCategoriesByName(req, res) {
        if (!req.params.name) {
            return res.sendStatus(400);
        }

        Category.find({catName: req.params.name},
            '-_id -__v -catName')
            .populate('leaves', '-_id -__v')
            .then((result)=> {
                return res.json(result);
            })
            .catch((err)=>{
                console.log(err);
                return res.sendStatus(500);
            });
    }
};