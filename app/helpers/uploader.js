module.exports = function (multer, Promise) {
    'use strict';

    var path = require('path');
    var moment = require('moment');
    var statAsync = Promise.promisify(require('fs').stat);
    var mkdirpAsync = Promise.promisify(require('mkdirp'));

    var ROOT_DIR = __dirname + '/../../uploads/';

    var storageImage = multer.diskStorage({
        destination: destinationImage,
        filename
    });

    var storageLayout = multer.diskStorage({
        destination: destinationLayout,
        filename
    });

    return {
        image: multer({storage: storageImage}),
        layout: multer({storage: storageLayout})
    };

    function destinationImage(req, file, next) {
        var dir = ROOT_DIR + 'pictures/' + moment().format('YYYY-MM-DD');
        checkOrCreateDir(dir, next);
    }

    function destinationLayout(req, file, next) {
        var dir = ROOT_DIR + 'ready/' + req.params.reference;
        checkOrCreateDir(dir, next);
    }

    function filename(req, file, next) {
        let parsed = path.parse(file.originalname);
        next(null, `${parsed.name}-${+moment()}${parsed.ext}`);
    }

    function checkOrCreateDir(dir, next) {
        // check if directory exists
        return statAsync(dir)
            .then((stats)=> {                   // node with this name exists
                if (stats.isDirectory()) {      // it is directory, all ok
                    next(null, dir);
                } else {                        // it is file, error
                    let err = new Error("Internal server error!");
                    next(err, dir);
                }
            })
            .catch(()=> {                       // node doesn't exist (NB! normal case)
                mkdirpAsync(dir)                // create new directory, then all ok
                    .then(()=> {
                        next(null, dir);
                    })
                    .catch((err)=> {
                        next(err, dir);
                    })
            });
    }

};