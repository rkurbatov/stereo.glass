(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgDigitalClock', sgDigitalClock);

    sgDigitalClock.$inject = ['$interval'];

    function sgDigitalClock($interval) {
        return {
            restrict: 'E',
            templateUrl: '/templates/directive/sgDigitalClock',
            scope: {
                isOpen: '=',
                timezone: '@',
                title: '=',
                onTimerClick: '&'
            },
            link
        };

        function link(scope, elm, attr) {
            var delimiter = true; // colon delimiter blinking every second
            scope.blank = '88:88';
            if (!attr.isOpen) {
                scope.isOpen = true;
            }
            if (!attr.onTimerClick) {
                scope.onTimerClick = ()=> angular.noop;
            }

            $interval(setCurrentTime, 1000);

            function setCurrentTime() {
                var curTime = moment().tz(scope.timezone || 'Europe/London');
                var timeFormat = delimiter ? 'HH:mm' : 'HH mm';
                scope.onTimerClick()(curTime);
                scope.time = curTime.format(timeFormat); // check time for open-close
                delimiter = !delimiter; // inverse for next tick
            }
        }
    }

})(window, window.angular);

