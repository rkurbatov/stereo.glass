(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgProgress', sgProgress);

    sgProgress.$inject = [];

    function sgProgress() {

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, elm, attrs) {
            scope.$watch(
                ()=> {
                    return attrs.sgProgress || 0;
                },
                (value)=> {
                    elm.css({'width': value + '%'});
                }
            );
        }
    }

})(window, window.angular);