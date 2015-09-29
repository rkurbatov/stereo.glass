// TODO rewrite completely differing file processing and uploading
module.exports = function (multer) {
    'use strict';

    var path = require('path');
    var moment = require('moment');
    var Promise = require('bluebird');
    var statAsync = Promise.promisify(require('fs').stat);
    var mkdirpAsync = Promise.promisify(require('mkdirp'));

    var storage = multer.diskStorage({
        destination,
        filename
    });

    function destination(req, file, next) {
        var dir = __dirname + '/../../uploads/pictures/' + moment().format('YYYY-MM-DD');

        // check if directory exists
        statAsync(dir)
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
                    .catch((err)=>{
                        next(err, dir);
                    })
            });
    }

    function filename(req, file, next) {
        let parsed = path.parse(file.originalname);
        next(null, `${parsed.name}-${+moment()}${parsed.ext}`);
    }

    return multer({storage});
};