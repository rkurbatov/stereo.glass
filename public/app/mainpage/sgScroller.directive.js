(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgScroller', sgScroller);

    sgScroller.$inject = ['$window', '$document', '$timeout', 'auxData'];

    function sgScroller($window, $document, $timeout, auxData) {

        return {
            restrict: 'A',
            replace: true,
            link: link
        };

        function link(scope, elm, attrs) {
            var calculatedBodyWidth;
            var scrollTimeout = null;
            var scrolls = {
                'right': scrollLeft,
                'down': scrollLeft,
                'left': scrollRight,
                'up': scrollRight,
                37: scrollLeft,
                38: scrollLeft,
                39: scrollRight,
                40: scrollRight
            };

            sizeBody();
            angular.element($window)
                .on('resize', sizeBody)
                .on('keydown', keyPressHandler)
                .on('mousewheel DOMMouseScroll', mouseScrollHandler);

            angular.element($document).swipe({
                // Generic swipe handler for all directions.
                swipe: (evt, direction)=> {
                    if (scrolls[direction]
                        && auxData.settings.handleScrollEvents
                        && auxData.settings.currentPage === 'main') {
                        scrolls[direction]();
                    }
                },
                threshold: 75
            });

            scope.$watch(
                ()=>auxData.settings.currentPage,
                (page)=> {
                    elm.css({
                        width: page === 'main'
                            ? calculatedBodyWidth
                            : ''
                    });
                });

            scope.main.scrollLeft = scrollLeft;
            scope.main.scrollRight = scrollRight;

            function scrollLeft() {
                angular.element($window).trigger('carousel:scrollLeft');
            }

            function scrollRight() {
                angular.element($window).trigger('carousel:scrollRight');
            }

            function sizeBody() {
                var windowWidth = angular.element($window).innerWidth();
                auxData.settings.screenCount = (angular.element('.sg-carousel-section') || []).length;
                calculatedBodyWidth = windowWidth * auxData.settings.screenCount;
                elm.css({
                    width: auxData.settings.currentPage === 'main'
                        ? calculatedBodyWidth
                        : ''
                });
            }

            function keyPressHandler(evt) {
                if (scrolls[evt.which]
                    && auxData.settings.handleScrollEvents
                    && auxData.settings.currentPage === 'main') {
                    scrolls[evt.which]();
                    evt.preventDefault();
                }
            }

            function mouseScrollHandler(e) {
                console.log('Happy mouse');
                if (!auxData.settings.handleScrollEvents) return;
                // Equalize event object.
                var evt = window.event || e;
                // Convert to originalEvent if possible.
                evt = evt.originalEvent ? evt.originalEvent : evt;
                // Check for detail first, because it is used by Opera and FF.
                var delta = evt.detail ? evt.detail * (-40) : evt.wheelDelta;

                var scrollEndDelay = 250;

                console.log(scrollTimeout);
                if (scrollTimeout === null) {
                    // scroll begin handler
                    if (delta > 1) {
                        scrollLeft();
                    } else if (delta < -1) {
                        scrollRight();
                    }
                } else {
                    clearTimeout(scrollTimeout);
                }

                scrollTimeout = setTimeout(()=> {
                    // scroll end handler
                    scrollTimeout = null;
                }, scrollEndDelay);

            }

        }

    }

})(window, window.angular);