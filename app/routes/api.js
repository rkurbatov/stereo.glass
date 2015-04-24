module.exports = function (app, express, mongoose, Account) {
    'use strict';

    var Router = express.Router();
    var Category = require('../models/category')(mongoose);
    var Layout = require('../models/layout')(mongoose);


    Router.get('/userlist', function (req, res) {
        if (req.isAuthenticated()) {
            Account.find({}, '-_id username role createdAt activeAt', function (err, users) {
                if (err) {
                    console.log(err);
                    res.status(400).end();
                }
                else {
                    res.send(JSON.stringify(users));
                }
            });
        } else {
            res.status(401).send('forbidden').end();
        }
    });

    Router.get('/layoutslist', function (req, res) {
        if (req.isAuthenticated()) {
            Layout.find({}, '-_id name url2d urlDir createdBy createdAt designerComment', function(err, layouts){
               if (err) {
                    console.log(err);
                    res.status(400).end();
                }
                else {
                    res.send(JSON.stringify(layouts));
                }
            });
        } else {
            res.status(401).send('forbidden').end();
        }

    });

    Router.get('/category', function (req, res) {
        var catname;

        if (req.isAuthenticated()) {
            catname = req.query.catname;
            Category.find({catName: catname},
                '-_id -__v -catName')
                .populate('leaves', '-_id -__v')
                .exec(function (err, result) {
                    if (err) {
                        dbAux.showError(err);
                        res.status(400).end();
                    } else {
                        res.json(result);
                    }
                });
        } else {
            res.status(401).send('forbidden').end();
        }
    });

    Router.post('/upload', require('../helpers/uploader')(), function(req,res) {
            console.log(res.sgUploader);
            res.json(res.sgUploader);
    });

    Router.post('/layout', function(req, res){
        if (req.isAuthenticated()) {

            var data = JSON.parse(req.body.data);
                data.createdBy = req.user._id;

            /*var layout = new Layout();
                layout.name = rb.name;
                layout.urlDir = rb.urlDir;
                layout.url2d = rb.url2d;
                layout.url3d = rb.url3d;
                layout.urlLayout = rb.urlLayout;
                rb.catColors.forEach(layout.catColors.set);*/

                //req.body.catColors.forEach(function(el) { layout.catColors.push(el) });
                //layout.catPlots.push(req.body.catPlots);
                //layout.catCountries.push(req.body.catCountries);
                //layout.catAssortment.push(req.body.catAssortment);

            Layout.create(data, function(err) {
                if (err) { 
                    console.log('Ошибка при сохранении макета!' + err);
                    res.json({error: true});
                } 
                else {
                    res.json({success: true});
                }
            });
            
        } else {
            res.status(401).send('forbidden').end();
        }

    });

    return Router;
};
