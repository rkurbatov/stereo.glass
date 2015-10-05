module.exports = function (express, uploader, Promise, Layout) {
    'use strict';

    var Router = express.Router();
    var helperEasyImg = require('../../helpers/easy-img')(Promise);
    var _ = require('lodash');

    Router.post('/picture', postPicture);
    Router.post('/layout/:reference', postLayoutByReference);

    return Router;

    // IMPLEMENTATION

    function postPicture(req, res) {
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        // upload with manual error handling
        uploader.image.single('picture')(req, res, (err)=> {
            var response = {
                url2d: req.file.filename
            };
            if (err) return res.sendStatus(500);

            // process uploaded image
            helperEasyImg
                .resizeOnUpload(req.file)
                .then((result)=> {
                    response.urlThumb = result.name;
                    return res.status(201).json(response);
                })
                .catch((err)=> {
                    console.log(err);
                    res.sendStatus(err.status || 500);
                });
        });
    }

    function postLayoutByReference(req, res) {
        if (!req.isAuthenticated()) {
            return res.sendStatus(403);
        }

        uploader.layout.single('file')(req, res, (err)=> {
            if (err) return res.sendStatus(500);
            let process = req.query.process;
            console.log('processing with: ', req.query.process);
            Layout
                .findOneAsync({reference: req.params.reference})
                .then((layout)=> {
                    if (!layout) {
                        var err = new Error();
                        err.status = 404;
                        throw err;
                    }

                    layout[req.query.field] = req.file.filename;

                    // check if should process files
                    if (_.contains(['mp4vid', 'gifmin'], process)) {
                        return helperEasyImg.convertImage(req.file, process, layout);
                    }

                    return layout;
                })
                .then((layout)=> {
                    return layout.save();
                })
                .then(()=> {
                    return res.sendStatus(200);
                })
                .catch((err)=> {
                    return res.status(err.status || 500).json({message: err.message});
                });
        });
    }
};
