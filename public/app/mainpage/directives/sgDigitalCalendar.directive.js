(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgDigitalCalendar', sgDigitalCalendar);

    sgDigitalCalendar.$inject = [];

    function sgDigitalCalendar() {
        return {
            restrict: 'E',
            templateUrl: '/templates/directive/sgDigitalCalendar',
            scope: {
                office: '='
            }
        };
    }

})(window, window.angular);