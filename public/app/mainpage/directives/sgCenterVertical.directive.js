(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgCenterVertical', sgCenterVertical);

    sgCenterVertical.$inject = ['$window', 'auxData'];

    function sgCenterVertical($window, auxData) {

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, elm, attrs) {
            scope.$on('carousel:redraw', ()=>scope.$applyAsync(()=>centerVertical()));

            function centerVertical() {
                console.log($window.innerHeight, elm.parent().innerHeight());
                var delta;
                if (attrs.sgCenterVertical === '-') {
                    delta = -($window.innerHeight - elm.parent().innerHeight()) / 2;
                } else {
                    delta = ($window.innerHeight - elm.innerHeight()) / 2;
                }
                // positve margin for neutralization of negative margin
                elm.css('marginTop', delta);
                console.log('delta is: ', delta);
            }
        }
    }

})(window, window.angular);

