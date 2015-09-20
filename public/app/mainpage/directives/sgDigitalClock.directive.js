(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgDigitalClock', sgDigitalClock);

    sgDigitalClock.$inject = ['$interval'];

    // sets variable for widescreen displays
    function sgDigitalClock($interval) {

        var template = `
            <div class="sg-digital-clock">
                <span class="background">{{blank}}</span>
                <span class="timer"
                ng-class="{'open': isOpen, 'closed': !isOpen}">{{time}}</span>
                <div class="foreground"></div>
            </div>
        `;

        return {
            restrict: 'E',
            template,
            link
        };

        function link(scope, elm, attrs) {
            scope.blank = '88:88';
            $interval(setCurrentTime, 1000);

            function setCurrentTime() {
                var date = moment().tz('Europe/Kiev');
                var hours = _.padLeft(date.hours(), 2, '0');
                var minutes = _.padLeft(date.minutes(), 2, '0');
                var divider = date.seconds() % 2 ? ' ' : ':';
                scope.time = hours + divider + minutes;
            }
        }
    }

})(window, window.angular);

