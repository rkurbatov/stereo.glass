(function () {
    'use strict';

    angular
        .module('sg.ui')
        .directive('sgCarouselSection', sgCarouselSection);

    function sgCarouselSection() {
        var ddo = {
            restrict: 'AC',
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {
            if (!scope.carousel.sections) {
                scope.carousel.sections = [];
            }
            scope.carousel.sections.push(elm);
        }
    }
})();
