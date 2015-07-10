(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgFileUpload', sgFileUpload);

    sgFileUpload.$inject = [];

    function sgFileUpload() {
        var ddo = {
            restrict: 'E',
            templateUrl: '/partials/directive-sgFileUpload',
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {
            scope.accept = attrs.accept;
            scope.$watch('file', function (newVal) {
                console.log('changed');
            });
        }
    }
})();