// sets variable for widescreen displays
function sgWideScreen($window, $parse){
    return {
        restrict: 'E',
        link: function(scope, elm, attrs) {
            var ratio = $parse(attrs.ratio)();
            angular.element($window).bind('load resize orientationchange', function() {
                var ww = $window.innerWidth, wh = $window.innerHeight;
                scope.main.isWideScreen = ww / wh > ratio;
                scope.$apply();
            });
        }
    }
}

function sgVideoOverlay() {
    return {
        restrict: 'C',
        template: '<div style="width: 100%; height: 100%;" ng-click="switchVideoState()"></div>',
        link: function (scope, elm, attrs) {
            var video = angular.element('#' + attrs.for)[0] || angular.element(attrs.for)[0];
            scope.main.isPlaying = false;

            scope.switchVideoState = function () {
                if (!scope.main.isPlaying) {
                    $('#cinema').animate({opacity: 0});
                    video.play();
                    scope.main.isPlaying = true;
                } else {
                    $('#cinema').animate({opacity: 1});
                    video.pause();
                    scope.main.isPlaying = false;
                }
            };

            scope.pauseVideo = function () {
                video.pause();
                scope.main.isPlaying = false;
            };

        }
    }
}