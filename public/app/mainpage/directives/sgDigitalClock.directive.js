(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgDigitalClock', sgDigitalClock);

    sgDigitalClock.$inject = ['$interval'];

    // sets variable for widescreen displays
    function sgDigitalClock($interval) {

        var template = `
            <div class="sg-digital-clock" title="{{title}}">
                <span class="background">{{blank}}</span>
                <span class="timer"
                ng-class="{'open': isOpen, 'closed': !isOpen}">{{time}}</span>
                <div class="foreground"></div>
            </div>
        `;

        return {
            restrict: 'E',
            template,
            scope: {
                timezone: '@',
                holidaysHandler: '&'
            },
            link
        };

        function link(scope, elm, attrs) {
            var delimiter = true; // colon delimiter blinking every second
            scope.blank = '88:88';
            scope.isOpen = true;

            $interval(setCurrentTime, 1000);

            function setCurrentTime() {
                var curTime = moment().tz(scope.timezone || 'Europe/London');
                var timeFormat = delimiter ? 'HH:mm' : 'HH mm';
                checkTime(curTime);
                scope.time = curTime.format(timeFormat); // check time for open-close
                delimiter = !delimiter; // inverse for next tick
            }

            function checkTime(time) {
                var day = time.day();
                var hour = time.hour();
                console.log(day);

                // Monday or Saturday - close and return
                if (!(scope.isOpen = day > 0 && day < 6)) {
                    scope.title = _INT("К сожалению сегодня - выходной день. Попробуйте позвонить к нам в понедельник или отправить запрос по электронной почте.");
                    return;
                }
                // Time is between 9:00 - 18:00 - close and return
                if (!(scope.isOpen = hour >= 9 && hour <= 17)) {
                    if (hour > 17) {
                        scope.title = _INT("Рабочий день завершён и мы не cможем принять ваш звонок. Отправьте свой запрос письмом по электронной почте.");
                    } else if (hour < 9) {
                        scope.title = _INT("Рабочий день еще не начался и мы не сможем принять ваш звонок. Позвоните попозже или отправьте свой запрос письмом по электронной почте.");
                    }
                    return;
                }

                scope.title = _INT("Мы готовы принять ваш звонок!");
            }
        }
    }

})(window, window.angular);

