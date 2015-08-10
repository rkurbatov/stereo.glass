module.exports = function (express) {
    'use strict';

    var Router = express.Router();

    Router.post('/', postFiles);

    // IMPLEMENTATION

    function postFiles(req, res) {
        return res.json(res.sgUploader);
    }

    return Router;
};
