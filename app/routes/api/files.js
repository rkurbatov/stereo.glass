module.exports = function (express, uploader, Layout) {
    'use strict';

    var Router = express.Router();
    var easyimg = require('easyimage');

    Router.post('/picture', postPicture);
    Router.post('/layout/:reference', postLayoutByReference);

    return Router;

    // IMPLEMENTATION

    function postPicture(req, res) {
        // upload with manual error handling
        uploader.image.single('picture')(req, res, (err)=> {
            var response = {
                url2d: req.file.filename
            };
            if (err) return res.sendStatus(500);

            // process uploaded image
            easyimg
                .info(req.file.path)
                .then((fileInfo)=> {
                    if (fileInfo.width > 1200 || fileInfo.height > 800) {
                        let scale;
                        let processObject = {
                            src: req.file.path,
                            dst: req.file.path
                        };

                        if (fileInfo.width > 1200) {
                            scale = fileInfo.width / 1200;
                            processObject.width = 1200;
                            processObject.height = Math.round(fileInfo.height / scale);
                        }
                        else {
                            scale = fileInfo.height / 800;
                            processObject.width = Math.round(fileInfo.width / scale);
                            processObject.height = 800;
                        }

                        console.log('resizing');
                        return easyimg.resize(processObject);
                    }
                })
                .then(()=> {
                    return easyimg.thumbnail({
                        src: req.file.path,
                        dst: req.file.destination + '/thumb250-' + req.file.filename,
                        width: 250
                    })
                })
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
        uploader.layout.single('file')(req, res, (err)=>{
            if (err) return res.sendStatus(500);
            res.sendStatus(200);
        });
    }

};
