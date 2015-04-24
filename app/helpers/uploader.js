module.exports = function () {
    'use strict';

    var mkdirp = require('mkdirp');
    var fs = require('fs');

    return require('multer')({
        dest: __dirname + '/../../uploads/',
        rename: multerRename,
        changeDest: multerChangeDest,
        onFileUploadComplete: multerFileUploadComplete
    });

    function multerRename(fieldname, filename, req, res) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
    }

    function multerFileUploadComplete(file, req, res) {
        if (!res.sgUploader) {
            res.sgUploader = {};
        }
        res.sgUploader.filename = file.name;
    }

    function multerChangeDest(dest, req, res) {
        var stat = null;
        var dir;

        if (!res.sgUploader) {
            res.sgUploader = {};
        }
        if (req.sgUploader && req.sgUploader.dest) {
            dir = req.sgUploader.dir;
        }
            else 
        { 
            dir = "layout-" + String(Date.now());
        }
        res.sgUploader.dir = dir;

        try {
          stat = fs.statSync('./uploads/'+'test');
        } catch(err) {
            if (stat && !stat.isDirectory()) {
                // Woh! This file/link/etc already exists, so isn't a directory. Can't save in it. Handle appropriately.
                throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + dir + '"');
            }
            mkdirp(dest + dir , function(err) {
                if (err){
                    console.log('Error creating directory ',err);
                    //throw err;
                }
            });
        }

        return dest + dir;
    }

};