(function () {
    'use strict';

    angular
        .module('sg.ui')
        .directive('sgCarousel', ['$window', sgCarousel]);

    function sgCarousel($window) {
        var ddo = {
            restrict: 'AC',
            link: {
                pre: preLink,
                post: postLink
            }
        };

        return ddo;

        function preLink(scope, elm, attrs) {
            scope.carousel = {
                sections: [],
                sectionWidth: $window.innerWidth
            }
        }

        function postLink(scope, elm, attrs) {
            angular.element($window).on('resize', function () {
                scope.carousel.sectionWidth = $window.innerWidth;
                resizeSections(scope.carousel)
            });
            resizeSections(scope.carousel);

            function resizeSections() {
                scope.carousel.sections.forEach(function (section) {
                    //section.css('width', scope.carousel.sectionWidth);
                })
            }
        }
    }

})();

