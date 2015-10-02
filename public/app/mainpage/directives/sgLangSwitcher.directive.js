(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgLangSwitcher', sgLangSwitcher);

    sgLangSwitcher.$inject = ['$rootScope', 'sgIntSvc', 'categoriesSvc'];

    function sgLangSwitcher($rootScope, sgIntSvc, categoriesSvc) {

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

            scope.switchLang = (code) => {
                sgIntSvc.switchLang(code);
                $rootScope.$broadcast('sg-lang-changed');
            }
        }

    }

})(window, window.angular);