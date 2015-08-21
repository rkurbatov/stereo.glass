module.exports = function (express, Layout) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');
    var Promise = require('bluebird');

    // DECLARATION

    Router.get('/', getGoods);

    return Router;

    // IMPLEMENTATION

    function getGoods(req, res) {
        var sel, findObj = {}, tmpArr = [], tmpDateQueryObj = {};

        findObj.status = 'approved';

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

        }

        Layout
            .find(findObj, '')
            .then((layouts)=> res.json(layouts))
            .catch((err)=> {
                console.log("Cant't find layouts: ", err);
                return res.sendStatus(500);
            });

    }



};
