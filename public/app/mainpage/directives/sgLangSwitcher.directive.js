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
            _.extend(scope, {
                isVisible: false,
                sgIntSvc
            });
        }

    }

})(window, window.angular);