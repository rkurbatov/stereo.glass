(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgCenterVertical', sgCenterVertical);

    sgCenterVertical.$inject = ['$window'];

    function sgCenterVertical($window) {
        var ddo = {
            restrict: 'A',
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {
            angular.element($window).on('carousel:resize', function (e) {
                var delta;
                if (attrs.sgCenterVertical === '-') {
                    delta = -($window.innerHeight - elm.parent().innerHeight()) / 2;
                } else {
                    delta = ($window.innerHeight - elm.innerHeight()) / 2;
                }
                // positve margin for neutralization of negative margin
                elm.css('marginTop', delta);
            });
        }
    }

})(window, window.angular);

