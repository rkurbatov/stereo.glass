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

            //angular.element($document).on('load', calcRatio);
            angular.element($window).on('resize orientationchange', ()=> {
                if (auxData.settings.currentPage === 'carousel') {
                    calcRatio();
                    scope.$emit('carousel:redraw');
                    scope.$broadcast('carousel:redraw');
                }
            });

            function calcRatio() {
                scope.$applyAsync(()=>{
                    var ww = $window.innerWidth, wh = $window.innerHeight;
                    /** @namespace attrs.ratio */
                    var isWS = ww / wh > borderRatio;
                    if (isWS) {
                        auxData.settings.coords = auxData.coordsWideScreen;
                    } else {
                        auxData.settings.coords = auxData.coordsNarrowScreen;
                    }
                    auxData.settings.isWideScreen = isWS;
                });

            }

            scope.$watch(()=> {
                    return auxData.settings.currentPage;
                },
                (page)=> {
                    // carousel should be redrawed, all scroll events should be listened to
                    if (page === 'carousel') {
                        auxData.settings.screenSections.length = 0;
                        auxData.settings.handleScrollEvents = true;
                        calcRatio();
                        // Init only after preloading some images
                        auxData.loader.staticPromise.then(()=> {
                            scope.$emit('carousel:redraw');
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

