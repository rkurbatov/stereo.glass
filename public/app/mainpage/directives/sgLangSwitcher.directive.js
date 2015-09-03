(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgLangSwitcher', sgLangSwitcher);

    sgLangSwitcher.$inject = ['sgIntSvc', '$document', '$window'];

    function sgLangSwitcher(sgIntSvc, $document, $window) {

        return {
            restrict: 'E',
            templateUrl: '/templates/directive/sgLangSwitcher',
            replace: true,
            link: link
        };

        function link(scope, elm, attrs) {
            scope.IntSvc = sgIntSvc;

            var flagElement = angular.element('.flag-container');
            angular.element($document).on('ready', rePosition);
            angular.element($window).on('resize', rePosition);

            function rePosition() {
                var newTop = flagElement.offset().top + flagElement.outerHeight();
                var newLeft = flagElement.offset().left;
                elm.offset({top: newTop, left: newLeft});
            }

        }
    }

})(window, window.angular);