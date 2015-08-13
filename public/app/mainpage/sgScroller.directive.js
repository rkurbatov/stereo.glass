(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgScroller', sgScroller);

    sgScroller.$inject = ['$window', '$document', 'auxData'];

    function sgScroller($window, $document, auxData) {

        return {
            restrict: 'A',
            replace: true,
            link: link
        };

        function link(scope, elm, attrs) {
            var calculatedBodyWidth;
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
                .on('keydown', keyPressHandler);

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

        }

    }

})(window, window.angular);