function sgCarousel($window) {
    return {
        restrict: 'AC',
        link: {
            pre: function (scope, elm, attrs) {
                scope.carousel = {
                    sections: [],
                    sectionWidth: $window.innerWidth
                };
            },
            post: function(scope, elm, attrs){
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
    }
}

function sgCarouselSection() {
    return {
        restrict: 'AC',
        link: function (scope, elm, attrs) {
            if (!scope.carousel.sections) {
                scope.carousel.sections = [];
            }
            scope.carousel.sections.push(elm);
        }

    }
}