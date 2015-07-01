(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgLayoutInfo', sgLayoutInfo);

    function sgLayoutInfo() {
        var ddo = {
            restrict: 'E',
            link: link,
            templateUrl: '/partials/directives-sgLayoutInfo'
        };

        return ddo;

        function link(scope, elm, attrs) {
            console.log('here I am');
        }
    }

})();