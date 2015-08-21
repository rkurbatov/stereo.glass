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
            link
        };

        function link(scope, elm, attrs) {
            // increase section count on each init
            scope.$applyAsync(()=>auxData.settings.screenSections.push(elm));

            scope.$on('carousel:redraw', ()=> {
                elm.width($window.innerWidth);
            });

        }

    }

})(window, window.angular);