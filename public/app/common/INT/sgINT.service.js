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
            reload,
            switchLang,
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
                .get('/api/lang')
                .then((response) => {
                    _.forEach(response.data, (lang) => langs.push(lang));
                    return langs;
                });
        }

        function add(code, name) {
            return $http
                .post('/api/lang', {code, name});
        }

    }

})(window, window.angular);