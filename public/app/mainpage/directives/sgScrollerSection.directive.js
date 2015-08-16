(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgScrollerSection', sgScrollerSection);

    sgScrollerSection.$inject = ['$window', 'auxData'];

    function sgScrollerSection($window, auxData) {

        return {
            restrict: 'A',
            replace: true,
            link: link
        };

        function link(scope, elm, attrs) {
            // increase section count on each init
            if (!auxData.settings.screenCount) {
                auxData.settings.screenCount = 1;
            } else {
                auxData.settings.screenCount +=1;
            }
            sizeSection();

            angular.element($window).on('resize', sizeSection);

            function sizeSection() {
                elm.width(angular.element($window).innerWidth());
            }

        }

    }

})(window, window.angular);