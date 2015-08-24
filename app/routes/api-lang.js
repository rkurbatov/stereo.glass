module.exports = function (express, Language, helperLang) {
    'use strict';

    var Router = express.Router();

    // DECLARATION

    // returns available language list
    Router.get('/list', getLanguages);
    // creates new language set
    Router.post('/', postLanguage);
    Router.put('/:code', putLanguageByCode);

    Router.get('/parse', parseLanguages);

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
                if (language) {
                    var err = new Error();
                    err.status = 409;
                    throw err;
                }
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
                return res.sendStatus(err.status || 500);
            });
    }

    function putLanguageByCode(req, res) {
        if (!req.isAuthenticated() || "admin" !== req.user.role) {
            return res.sendStatus(403);
        }

        if (!req.body.name || !req.body.isActive) {
            return res.sendStatus(400);
        }

        Language
            .findOne({code: req.params.code})
            .then((language)=> {
                if (!language) {
                    let err = new Error();
                    err.status = 404;
                    throw err;
                }

                if (req.body.name) language.name = req.body.name;
                if (req.body.isActive === true || req.body.isActive === false) language.isActive = req.body.isActive;

                return language.save();

            })
            .then(()=> res.sendStatus(200))
            .catch((err)=> {
                console.log("Can't modify language: ", err);
                return res.sendStatus(err.status || 500)
            })
    }

    function parseLanguages(req, res) {
        if (!req.isAuthenticated() || "admin" !== req.user.role) {
            return res.sendStatus(403);
        }

        console.log('Parsing language files');
        helperLang.parse()
            .then((parsedStrings)=> {
                helperLang.updateDB(parsedStrings);
                return res.sendStatus(200);
            })
            .catch((err)=> {
                console.log("Can't parse files: ", err);
                return res.sendStatus(500);
            });
    }

};
