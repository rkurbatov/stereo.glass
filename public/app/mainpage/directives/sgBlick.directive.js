(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgBlick', sgBlick);

    sgBlick.$inject = ['$window', '$timeout', '$interval'];

    function sgBlick($window, $timeout, $interval) {

        return {
            restrict: 'A',
            link
        };

        function link(scope, elm, attrs) {
            var delay = attrs.delay || 0;
            var speed = attrs.speed || 200;         // blick speed in pxs per second
            var interval = attrs.interval || 10;    // blick every 10s
            var random = attrs.random
                ? (attrs.random === '' ? 1 : attrs.random)
                : 0;
            var duration;

            var elmWidth = 0;

            angular.element($window).on('load resize', ()=> {
                elmWidth = elm.width();
            });

            // random interval = interval (in s) +/- random value < random attr (in s)
            // converted to ms
            var rndInterval = (interval + random * (Math.random() * 2 - 1)) * 1000;

            // set blick time depending on speed param and element length
            scope.$watch(
                ()=> {
                    return elmWidth;
                },
                (newWidth, oldWidth)=> {
                    if (newWidth && newWidth !== oldWidth) {
                        duration = newWidth / speed;
                        elm.css('transition-duration', duration + "s");
                    }
                });

            $timeout($interval(cbBlick, rndInterval), delay);

            function cbBlick() {
                // set style to 'hovered' for
                elm.toggleClass('hovered');
                setTimeout(()=> {
                    elm.toggleClass('hovered')
                }, Number(duration * 1000));
            }
        }
    }

})(window, window.angular);