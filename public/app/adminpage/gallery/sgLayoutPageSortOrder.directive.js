(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgLayoutPageSortOrder', sgLayoutPageSortOrder);

    sgLayoutPageSortOrder.$inject = [];

    function sgLayoutPageSortOrder() {
        var ddo = {
            restrict: 'E',
            link: link,
            templateUrl: '/partials/directives-sgLayoutPageSortOrder'
        };

        return ddo;

        function link(scope, elm, attrs) {

        }
    }

})(window, window.angular);