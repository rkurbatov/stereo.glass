module.exports = function (app) {
    'use strict';

    var mkdirp = require('mkdirp');
    var fs = require('fs');
    var easyimg = require('easyimage');
    var multer = require('multer');

    app.use(multer({
        dest: __dirname + '/../../uploads/',
        rename: multerRename,
        changeDest: multerChangeDest,
        onFileUploadComplete: multerFileUploadComplete
    }));

    function multerRename(fieldname, filename, req, res) {
        return filename.replace(/\W+/g, '-').toLowerCase() + '-' + Date.now();
    }

    function multerChangeDest(dest, req, res) {
        var stat = null;
        var dir;
        if (req.body.uploadDir) {
            dir = req.body.uploadDir;
        } else {
            dir = String(Date.now());
        }

        if (!res.sgUploader) {
            res.sgUploader = {};

            res.sgUploader.urlDir = dir;

            try {
                stat = fs.statSync(dest + dir);
            } catch (err) {
                if (stat && !stat.isDirectory()) {
                    // Woh! This file/link/etc already exists, so isn't a directory. Can't save in it. Handle appropriately.
                    throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + dir + '"');
                }
                mkdirp(dest + dir, function (err) {
                    if (err) {
                        console.log('Error creating directory ', err);
                        //throw err;
                    }
                });
            }
            return dest + dir;
        }
    }

    //TODO: rework completely, update layout from here
    function multerFileUploadComplete(file, req, res) {

        if (!res.sgUploader.filenames) {
            res.sgUploader.filenames = [];
        }

        res.sgUploader.filenames.push(file.name);
        var subdir = (req.body.uploadDir ? req.body.uploadDir + '/' : '');
        var fPath = __dirname + '/../../uploads/' + subdir;

        switch (req.params.process) {
            case 'thumbnail':
                res.sgUploader.urlThumb = 'thumb250-' + file.name;
                break;
            case 'firstframe':
                res.sgUploader.urlGifThumb = 'ff-' + file.name;
                break;
        }

        easyimg
            .info(fPath + file.name)
            .then((fileInfo)=> {
                switch (req.params.process) {
                    case 'thumbnail':
                        let processObject = {
                            src: fPath + file.name,
                            dst: fPath + 'thumb250-' + file.name,
                            width: 250,
                            fill: true
                        };

                        return easyimg.thumbnail(processObject);

                    case 'firstframe':
                        let srcImg = fPath + file.name,
                            dstImg = fPath + 'ff-' + file.name;

                        return easyimg.convert(`${srcImg}[0] ${dstImg}`);
                }

                // if without processing
                return null;
            })
            .then((result)=> {
                if (result) console.log('processed %s', fPath + file.name);
            });
    }

};