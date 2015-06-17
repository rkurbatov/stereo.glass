function sgAltSrc($parse){
    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
            var key = attrs.sgAltSrc;
            var source = scope.$parent.loader.bkImgs[key];
            var altSource = scope.$parent.loader.animImgs[key];
            if (source) {
                scope.$watch(function(){return source.loaded}, function(newVal){
                    if (newVal && !elm[0].src) {
                        elm[0].src = source.src;
                    }
                });
            }
            if (altSource) {
                scope.$watch(function(){return altSource.loaded}, function(newVal){
                   if (newVal) {
                       elm[0].src = altSource.src;
                   }
                });
            }
        }
    }
}

// sets variable for widescreen displays
function sgWideScreen($window, $parse){
    return {
        restrict: 'E',
        link: function(scope, elm, attrs) {
            var ratio = $parse(attrs.ratio)();
            angular.element($window).on('load resize orientationchange', function() {
                var ww = $window.innerWidth, wh = $window.innerHeight;
                scope.main.isWideScreen = ww / wh > ratio;
                scope.$apply();
            });
            angular.element($window).on('carousel:scroll', function(e){
               scope.main.screenIndex = e.index;
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

            $(window).on('keypress', function(e) {
                if ((e.keyCode == 0 || e.keyCode == 32) && scope.main.screenIndex === 0) {
                    scope.switchVideoState();
                }
            });

            scope.switchVideoState = function () {
                if (!scope.main.isPlaying) {
                    $('#cinema, header').animate({opacity: 0});
                    video.play();
                    scope.main.isPlaying = true;
                } else {
                    $('#cinema, header').animate({opacity: 1});
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