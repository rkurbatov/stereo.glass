(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .factory('sgINT', sgINT);

    sgINT.$inject = ['$cookies'];

    function sgINT($cookies) {

        return {
            langs: ['EN', 'CN', 'RU'],
            currentLang: 'EN'
        };
    }

})(window, window.angular);