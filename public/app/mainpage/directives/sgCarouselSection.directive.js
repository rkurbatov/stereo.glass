(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgCarouselSection', sgCarouselSection);

    sgCarouselSection.$inject = ['$window', 'auxData'];

    function sgCarouselSection($window, auxData) {

        return {
            restrict: 'C',
            replace: true,
            link
        };

        function link(scope, elm, attrs) {
            // increase section count on each init
            scope.$applyAsync(()=>auxData.settings.screenSections.push(elm));

            scope.$on('carousel:redraw', ()=> {
                if ($window.innerWidth > 480) {
                    elm.height($window.innerHeight);
                    elm.width($window.innerWidth);
                } else {
                    elm.height('');
                    elm.width('');
                }
            });

        }

    }

})(window, window.angular);