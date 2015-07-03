module.exports = function (express) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');

    Router.post('/', postFiles);

    // IMPLEMENTATION

    function postFiles(req, res) {
        res.json(res.sgUploader);
    }

    return Router;
};
