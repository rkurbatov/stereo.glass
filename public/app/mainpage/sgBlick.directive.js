(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgBlick', sgBlick);

    sgBlick.$inject = [];

    function sgBlick() {

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, elm, attrs) {
            var delay = attrs.delay || 0;
            var speed = attrs.speed || 200;         // blick speed in pxs per second
            var interval = attrs.interval || 10;    // blick every 10s
            var random = attrs.random
                ? (attrs.random === '' ? 1 : attrs.random)
                : 0;
            var duration;

            // random interval = interval (in s) +/- random value < random attr (in s)
            // converted to ms
            var rndInterval = (interval + random * (Math.random() * 2 - 1)) * 1000;

            // set blick time depending on speed param and element length
            scope.$watch(
                ()=> elm.width(),
                (newVal, oldVal)=> {
                    if (newVal && newVal !== oldVal) {
                        duration = newVal / speed;
                        elm.css('transition-duration', duration + "s");
                    }
                });

            setTimeout(setInterval(cbBlick, rndInterval), delay);

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