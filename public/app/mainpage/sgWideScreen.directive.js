(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgWideScreen', sgWideScreen);

    sgWideScreen.$inject = ['$document', '$window', 'auxData'];

    // sets variable for widescreen displays
    function sgWideScreen($document, $window, auxData) {

        return {
            restrict: 'E',
            link: link
        };

        function link(scope, elm, attrs) {

            angular.element($document).on('load', calcRatio);
            angular.element($window).on('resize orientationchange', calcRatio);
            angular.element($window).on('carousel:scroll', setScreenIndex);

            function calcRatio() {
                var ww = $window.innerWidth, wh = $window.innerHeight;
                /** @namespace attrs.ratio */
                auxData.settings.isWideScreen = ww / wh > attrs.ratio;
            }

            function setScreenIndex(evt) {
                auxData.settings.screenIndex = evt.index;
            }

            scope.$watch(auxData.settings.isWideScreen,
                function (newVal) {
                    if (newVal) {
                        auxData.settings.coords = auxData.coordsWideScreen;
                    } else {
                        auxData.settings.coords = auxData.coordsNarrowScreen;
                    }
                });

        }
    }

})(window, window.angular);

