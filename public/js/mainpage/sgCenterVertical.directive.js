(function () {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgCenterVertical', sgCenterVertical);

    sgCenterVertical.$inject = ['$window'];

    function sgCenterVertical($window) {
        var ddo =  {
            restrict: 'A',
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {
            angular.element($window).on('carousel:resize', function (e) {
                var delta = ($window.innerHeight - elm.innerHeight()) / 2;
                elm.css('marginTop', delta);
            });
        }
    }

})();

