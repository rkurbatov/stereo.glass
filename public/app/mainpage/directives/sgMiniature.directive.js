(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgMiniature', sgMiniature);

    sgMiniature.$inject = [];

    function sgMiniature() {

        return {
            restrict: 'E',
            templateUrl: '/templates/directive/sgMiniature',
            link,
            scope: {}
        };

        function link(scope, elm, attrs) {
            scope.src = attrs.src || '';
        }
    }

})(window, window.angular);