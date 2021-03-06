module.exports = function (express, Promise, Language, CatLeaf) {
    'use strict';

    var Router = express.Router();
    var _ = require('lodash');
    var helperLang = require('../../helpers/lang')(Promise, Language);

    // DECLARATION

    // returns available language list
    Router.get('/list', getLanguages);
    Router.get('/parse', parseLanguages);
    Router.get('/translation/:code', getTranslateByCode);
    Router.get('/switch/:code', switchLanguageByCode);
    // creates new language set
    Router.post('/', postLanguage);
    Router.put('/edit/:code', putLanguageByCode);
    Router.put('/translation/:code/:hash', putLanguageTranslateByCodeAndHash);

    return Router;

    // IMPLEMENTATION

    function getLanguages(req, res) {
        var findObj = {};

        // Interpreters can use only assigned language (for translation)
        if (req.isAuthenticated() && req.user.role === 'interpreter') {
            findObj.code = req.user.assignedLanguage;
        }

        Language
            .findAsync(findObj, '-_id -__v -data')
            .then((languages)=> res.json(languages))
            .catch((err)=> {
                console.log("Can't get language list: ", err);
                return res.sendStatus(500);
            });
    }

    function switchLanguageByCode(req, res) {
        Language
            .findOne({code: req.params.code})
            .then((language)=> {
                if (!language) return res.sendStatus(404);

                var dictionary = {};
                _.each(language.data, (element)=> {
                    if (element.tr) {
                        dictionary[element.hash] = element.tr;
                    }
                });

                return res.json(dictionary);
            })
            .catch((err)=> {
                console.log("Can't send dictionary: ", err);
                res.sendStatus(err.status || 500);
            });
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
            .then(()=> res.sendStatus(201))
            .catch((err)=> {
                console.log("Finding duplicate language error: ", err);
                return res.sendStatus(err.status || 500);
            });
    }

    function getTranslateByCode(req, res) {
        if (!req.isAuthenticated()
            || !_.contains(["admin", "interpreter"], req.user.role)) {
            return res.sendStatus(403);
        }

        Language.findOne({code: req.params.code})
            .then((language)=> {
                if (!language) {
                    var err = new Error("Languages not found");
                    err.status = 404;
                    throw err;
                }

                return res.json(language.data);
            })
            .catch((err)=> {
                console.log("Can't get language: ", err);
                return res.sendStatus(err.status || 500);
            })
    }

    function putLanguageByCode(req, res) {
        if (!req.isAuthenticated() || "admin" !== req.user.role) {
            return res.sendStatus(403);
        }

        if (!req.body.name && !req.body.isActive) {
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
        if (!req.isAuthenticated()
            || !_.contains(["admin", "interpreter"], req.user.role)) {
            return res.sendStatus(403);
        }

        console.log('Parsing language files and DB');

        var dbPromise = CatLeaf
            .find({})
            .then((result)=> {
                return _.without(_.map(result, (v)=>v.name || v.subtext), undefined);
            });

        var templatesPromise = helperLang.parse();

        Promise
            .all([dbPromise, templatesPromise])
            .then((parsedStrings)=> {
                return helperLang.updateDB(_.flatten(parsedStrings));
            })
            .then(()=>res.sendStatus(200))
            .catch((err)=> {
                console.log("Can't parse files: ", err);
                return res.sendStatus(err.status || 500);
            });
    }

    function putLanguageTranslateByCodeAndHash(req, res) {
        if (!req.isAuthenticated()
            || !_.contains(["admin", "interpreter"], req.user.role)) {
            return res.sendStatus(403);
        }

        if (_.isUndefined(req.body.translation)) return res.sendStatus(400);

        Language
            .findOne({code: req.params.code})
            .then((language)=> {
                if (!language) {
                    let err = new Error();
                    err.status = 404;
                    throw err;
                }

                // !!! Hash is NUMBER value !!!
                var idx = _.findIndex(language.data, 'hash', Number(req.params.hash));
                if (idx === -1) {
                    let err = new Error();
                    err.status = 404;
                    throw err;
                }

                language.data[idx].tr = req.body.translation;
                language.data[idx].status = req.body.translation ? '!' : '+';

                return language.save();

            })
            .then(()=> res.sendStatus(200))
            .catch((err)=> {
                console.log("Can't modify translation: ", err);
                return res.sendStatus(err.status || 500)
            })
    }

};
