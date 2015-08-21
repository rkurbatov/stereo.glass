(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgEventListener', sgEventListener);

    sgEventListener.$inject = ['$document', '$window', 'auxData'];

    // sets variable for widescreen displays
    function sgEventListener($document, $window, auxData) {

        return {
            restrict: 'E',
            link
        };

        function link(scope, elm, attrs) {

            var borderRatio = 1.85;

            angular.element($document).on('load', calcRatio);
            angular.element($window).on('resize orientationchange', ()=>{
                if (auxData.settings.currentPage === 'index') {
                    scope.$emit('carousel:redraw');
                    scope.$broadcast('carousel:redraw');
                }
            });

            function calcRatio() {
                var ww = $window.innerWidth, wh = $window.innerHeight;
                /** @namespace attrs.ratio */
                auxData.settings.isWideScreen = ww / wh > borderRatio;
            }

            scope.$watch(auxData.settings.isWideScreen,
                function (newVal) {
                    if (newVal) {
                        auxData.settings.coords = auxData.coordsWideScreen;
                    } else {
                        auxData.settings.coords = auxData.coordsNarrowScreen;
                    }
                });

            scope.$watch(()=> {
                    return auxData.settings.currentPage;
                },
                (page)=> {
                    // carousel should be redrawed, all scroll events should be listened to
                    if (page === 'index') {
                        auxData.settings.screenSections.length = 0;
                        auxData.settings.handleScrollEvents = true;
                        scope.$emit('carousel:redraw');
                        // Init only after preloading some images
                        auxData.loader.staticPromise.then(()=>{
                           scope.$broadcast('carousel:redraw');
                        });
                        // A kind of black magic but broadcasting isn't needed here
                    } else {
                        auxData.settings.handleScrollEvents = false;
                    }
                });

        }
    }

})(window, window.angular);

