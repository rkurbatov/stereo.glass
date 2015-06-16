angular.module('sg.ui', [])
    .factory('sgPreloader', sgPreloader)
    .directive('sgCarousel', ['$window', sgCarousel])
    .directive('sgCarouselSection', sgCarouselSection)
    .directive('sgPlate3d', ['$parse', '$window', '$timeout', 'sgPlate3dOptions', sgPlate3d])
    .provider('sgPlate3dOptions', function () {
        this.options = {};

        this.$get = function () {
            return this.options;
        };

        this.setCustomEvent = function (evtName) {
            this.options.customEvent = evtName;
        };
    });
