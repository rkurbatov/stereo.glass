(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgLangSwitcher', sgLangSwitcher);

    sgLangSwitcher.$inject = ['sgIntSvc'];

    function sgLangSwitcher(sgIntSvc) {

        var isVisible = false;

        return {
            restrict: 'E',
            templateUrl: '/templates/directive/sgLangSwitcher',
            replace: true,
            link
        };

        function link(scope, elm, attrs) {
            scope.IntSvc = sgIntSvc;
            scope.switchLang = switchLang;
            scope.toggleSwitcher = toggleSwitcher;
            scope.closeSwitcher = closeSwitcher;

            function toggleSwitcher() {
                var switcher = angular.element('.lang-switcher')[0];
                angular.element(switcher).toggleClass('visible');
                isVisible = !isVisible;
            }

            function closeSwitcher() {
                if (isVisible) toggleSwitcher();
            }

            function switchLang(code) {
                sgIntSvc.switchLang(code);
                closeSwitcher();
            }
        }

    }

})(window, window.angular);