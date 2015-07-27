(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgWideScreen', sgWideScreen);

    sgWideScreen.$inject = ['$document', '$window'];

    // sets variable for widescreen displays
    function sgWideScreen($document, $window) {
        var ddo = {
            restrict: 'E',
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {

            angular.element($document).on('load', calcRatio);
            angular.element($window).on('resize orientationchange', calcRatio);
            angular.element($window).on('carousel:scroll', setScreenIndex);

            function calcRatio() {
                var ww = $window.innerWidth, wh = $window.innerHeight;
                scope.main.isWideScreen = ww / wh > attrs.ratio;
            }

            function setScreenIndex(evt) {
                scope.main.screenIndex = evt.index;
            }
        }
    }

})(window, window.angular);

