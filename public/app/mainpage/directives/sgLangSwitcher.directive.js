(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgLangSwitcher', sgLangSwitcher);

    sgLangSwitcher.$inject = ['sgIntSvc'];

    function sgLangSwitcher(sgIntSvc) {

        return {
            restrict: 'E',
            templateUrl: '/templates/directive/sgLangSwitcher',
            replace: true,
            scope: {},
            link
        };

        function link(scope, elm, attrs) {
            scope.IntSvc = sgIntSvc;
            scope.switchLang = switchLang;
            scope.toggleSwitcher = toggleSwitcher;
            scope.closeSwitcher = closeSwitcher;
            scope.isVisible = false;

            function toggleSwitcher() {
                /*var switcher = angular.element('.lang-switcher')[0];
                angular.element(switcher).toggleClass('visible');*/
                scope.isVisible = !scope.isVisible;
            }

            function closeSwitcher() {
                console.log('isVisible: ', isVisible);
                if (scope.isVisible) toggleSwitcher();
            }

            function switchLang(code) {
                sgIntSvc.switchLang(code);
                closeSwitcher();
            }
        }

    }

})(window, window.angular);