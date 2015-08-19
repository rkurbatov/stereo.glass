(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgLangSwitcher', sgLangSwitcher);

    sgLangSwitcher.$inject = ['sgINTSvc', '$window'];

    function sgLangSwitcher(sgINTSvc, $window) {

        return {
            restrict: 'E',
            templateUrl: '/templates/directive/sgLangSwitcher',
            replace: true,
            link: link
        };

        function link(scope, elm, attrs) {
            scope.INTSvc = sgINTSvc;

            var flagElement = angular.element('.flag-container');
            angular.element($window).on('load resize', rePosition);

            function rePosition() {
                var newWidth = flagElement.width();
                var newTop = flagElement.offset().top + flagElement.outerHeight();
                var newLeft = flagElement.offset().left;

                elm.width(newWidth);
                elm.offset({top: newTop, left: newLeft});
            }

        }
    }

})(window, window.angular);