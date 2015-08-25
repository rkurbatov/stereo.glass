(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sg.i18n')
        .factory('sgIntSvc', sgIntSvc);

    sgIntSvc.$inject = ['$http'];

    function sgIntSvc($http) {

        var langs = [];

        init();

        return {
            langs,
            add,
            update,
            reload,
            switchLang,
            parse,
            getTranslation,
            putTranslation,
            currentLang: 'EN'
        };

        function init() {
            reload();
        }

        function switchLang(code) {

        }

        function reload() {
            langs.length = 0;
            return $http
                .get('/api/lang/list')
                .then((response) => {
                    _.forEach(response.data, (lang) => langs.push(lang));
                    return langs;
                });
        }

        function add(code, name) {
            return $http
                .post('/api/lang', {code, name});
        }

        function update(lang) {
            var updateObject = {
                name: lang.name,
                isActive: lang.isActive
            };
            return $http.put('/api/lang/edit' + lang.code, updateObject);
        }

        function parse() {
            return $http.get('/api/lang/parse');
        }

        function getTranslation(langCode) {
            return $http.get('/api/lang/translation/' + langCode);
        }

        function putTranslation(langCode, trString) {
            var queryString = '/api/lang/translation/' + langCode + '/' + trString.hash;
            return $http.put(queryString, {translation: trString.tr});
        }

    }

})(window, window.angular);