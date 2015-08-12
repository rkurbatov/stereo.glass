(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgScroller', sgScroller);

    sgScroller.$inject = ['$window', 'auxData'];

    function sgScroller($window, auxData) {

        return {
            restrict: 'A',
            replace: true,
            link: link
        };

        function link(scope, elm, attrs) {
            var calculatedBodyWidth;

            sizeBody();
            angular.element($window).on('resize', sizeBody);

            scope.$watch(
                ()=>auxData.settings.currentPage,
                (page)=> {
                    elm.css({
                        width: page === 'main'
                            ? calculatedBodyWidth
                            : ''
                    });
                });

            function sizeBody() {
                var winWidth = angular.element($window).innerWidth();
                var sectionsNumber = (angular.element('.sg-carousel-section') || []).length;
                calculatedBodyWidth = winWidth * sectionsNumber;
                elm.css({
                    width: auxData.settings.currentPage === 'main'
                        ? calculatedBodyWidth
                        : ''
                });
            }

        }

    }

})(window, window.angular);