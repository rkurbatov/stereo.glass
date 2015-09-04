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
            link: link
        };

        function link(scope, elm, attrs) {
            scope.IntSvc = sgIntSvc;
            scope.switchLang = switchLang;

            function switchLang(code) {
                sgIntSvc.switchLang(code);
            }
        }
    }

})(window, window.angular);