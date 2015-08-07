(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgLangSwitcher', sgLangSwitcher);

    sgLangSwitcher.$inject = ['sgINT', '$window'];

    function sgLangSwitcher(sgINT, $window) {

        return {
            restrict: 'E',
            templateUrl: '/partials/directive-sgLangSwitcher',
            replace: true,
            link: link
        };

        function link(scope, elm, attrs) {
            scope.INT = sgINT;

            var flagElement = angular.element('#flag-container');
            angular.element($window).on('load resize', rePosition);

            function rePosition() {
                var newWidth = flagElement.width();
                var newTop = flagElement.offset().top + flagElement.height();
                var newLeft = flagElement.offset().left;

                elm.width(newWidth);
                elm.offset({top: newTop, left: newLeft});
            }

        }
    }

})(window, window.angular);