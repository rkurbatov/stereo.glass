(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgScrollerSection', sgScrollerSection);

    sgScrollerSection.$inject = ['$window'];

    function sgScrollerSection($window) {

        return {
            restrict: 'A',
            replace: true,
            link: link
        };

        function link(scope, elm, attrs) {
            sizeSection();

            angular.element($window).on('resize', sizeSection);

            function sizeSection() {
                elm.width(angular.element($window).innerWidth());
            }

        }

    }

})(window, window.angular);