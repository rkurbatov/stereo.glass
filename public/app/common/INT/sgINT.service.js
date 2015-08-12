(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgINT')
        .factory('sgINTSvc', sgINTSvc);

    sgINTSvc.$inject = ['$cookies', '$http'];

    function sgINTSvc($cookies, $http) {

        var langs = [];

        init();

        return {
            langs: langs,
            reload: reload,
            currentLang: 'EN',
            switchLang: switchLang
        };

        function init() {
            reload();
        }

        function switchLang(code) {

        }

        function reload() {
            langs.length = 0;
            $http
                .get('/api/lang')
                .then((response) => {
                    _.forEach(response.data, (lang) => langs.push(lang));
                });
        }

    }

})(window, window.angular);