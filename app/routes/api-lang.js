module.exports = function (express, Language, Account) {
    'use strict';

    var Router = express.Router();

    // DECLARATION

    // returns language list supported by system
    Router.get('/', getLanguages);
    // creates new language set
    Router.post('/', postLanguage);

    return Router;

    // IMPLEMENTATION

    function getLanguages(req, res) {
        Language
            .find({}, '-_id -__v -data')
            .then(function (languages) {
                return res.json(languages);
            })
            .catch(function (err) {
                console.log("Can't get language list: ", err);
                return res.sendStatus(500);
            })
    }

    function postLanguage(req, res) {
        if (!req.isAuthenticated() || req.user.role !== "admin") {
            return res.sendStatus(403);
        }

        if (!req.body.code || !req.body.name) {
            return res.sendStatus(400);
        }

        Language
            .findOne({code: req.body.code})
            .then(function (language) {
                if (language) return res.sendStatus(409);
                language = {
                    code: req.body.code,
                    name: req.body.name
                };
                return Language.createAsync(language);
            })
            .then(function () {
                return res.sendStatus(201);
            })
            .catch(function (err) {
                console.log("Finding duplicate language error: ", err);
                return res.sendStatus(500);
            });
    }

};
