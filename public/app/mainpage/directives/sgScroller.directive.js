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

            scope.$on('carousel:redraw', ()=>scope.$applyAsync(()=>{
                sizeBody();
                // move to correct offset after resize and orientation change
                scrollTo(auxData.settings.screenIndex, 0)
            }));

            scope.$watch(
                ()=>auxData.settings.currentPage,
                (page)=>{
                    if (page === 'index') {
                        sizeBody();
                    } else {
                        elm.css({ width: '' });
                    }
                }
            );

            angular.element($window)
                .on('keydown', keyPressHandler)
                .on('mousewheel DOMMouseScroll', mouseScrollHandler);


            // TODO: check if $window swipe working.
            angular.element($document).swipe({
                // Generic swipe handler for all directions.
                swipe: (evt, direction)=> {
                    if (scrolls[direction]
                        && auxData.settings.handleScrollEvents) {
                        scrolls[direction]();
                    }
                },
                threshold: 75
            });

            scope.header.scrollLeft = scrollLeft;
            scope.header.scrollRight = scrollRight;

            function scrollTo(index, speed) {
                var sectionOffset = angular.element(auxData.settings.screenSections[index]).offset();
                auxData.settings.screenIndex = index;
                $('html,body').animate({scrollLeft: sectionOffset.left}, speed, 'swing');
            }

            function scrollLeft() {
                if (auxData.settings.screenIndex === 0) {
                    scrollTo(auxData.settings.screenSections.length - 1, 1000);
                } else {
                    scrollTo(auxData.settings.screenIndex - 1, 500);
                }
            }

            function scrollRight() {
                if (auxData.settings.screenIndex === auxData.settings.screenSections.length - 1) {
                    scrollTo(0, 1000);
                } else {
                    scrollTo(auxData.settings.screenIndex + 1, 500);
                }
            }

            function sizeBody() {
                var windowWidth = $window.innerWidth;
                calculatedBodyWidth = windowWidth * auxData.settings.screenSections.length;
                elm.css({ width: calculatedBodyWidth });
            }

            function keyPressHandler(evt) {
                if (scrolls[evt.which]
                    && auxData.settings.handleScrollEvents) {
                    scrolls[evt.which]();
                    evt.preventDefault();
                }
            }

            function mouseScrollHandler(e) {
                if (!auxData.settings.handleScrollEvents) return;
                // Equalize event object.
                var evt = window.event || e;
                // Convert to originalEvent if possible.
                evt = evt.originalEvent ? evt.originalEvent : evt;
                // Check for detail first, because it is used by Opera and FF.
                var delta = evt.detail ? evt.detail * (-40) : evt.wheelDelta;

                var scrollEndDelay = 250;

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