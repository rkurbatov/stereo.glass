(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sg.i18n')
        .factory('sgIntSvc', sgIntSvc);

    sgIntSvc.$inject = ['$http', '$rootScope'];

    function sgIntSvc($http, $rootScope) {

        var svc = {
            langs: [],
            currentLang: 'RU',
            add,
            update,
            reload,
            switchLang,
            parse,
            getTranslation,
            putTranslation
        };

        init();

        return svc;

        function init() {
            // TODO get language from localStorage
            reload();
        }

        function switchLang(code) {
            $http
                .get('/api/lang/switch/' + code)
                .then((response)=> {
                    for (var key in window._LANG_) {
                        delete window._LANG_[key];
                    }
                    $rootScope.$applyAsync(()=> _.extend(window._LANG_, response.data));
                    svc.currentLang = code;
                })
        }

        function reload() {
            svc.langs.length = 0;
            return $http
                .get('/api/lang/list')
                .then((response) => {
                    _.forEach(response.data, (lang) => svc.langs.push(lang));
                    return svc.langs;
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
            return $http.put('/api/lang/edit/' + lang.code, updateObject);
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