(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgVideoOverlay', sgVideoOverlay);

    sgVideoOverlay.$inject = ['$window', 'auxData'];

    function sgVideoOverlay($window, auxData) {

        return {
            restrict: 'C',
            template: '<div style="width: 100%; height: 100%;" ng-click="switchVideoState()"></div>',
            link: link
        };

        function link(scope, elm, attrs) {
            scope.index.isPlaying = false;
            scope.switchVideoState = switchVideoState;
            scope.pauseVideo = pauseVideo;

            angular.element($window).on('keypress', function (e) {
                if (e.keyCode == 0 || e.keyCode == 32) {
                    scope.switchVideoState();
                }
            });

            angular.element($window).on('carousel:scroll', function (e) {
                if (scope.index.isPlaying && e.index !== 0) {
                    scope.switchVideoState();
                }
            });

            var video = angular.element('#' + attrs.for)[0] || angular.element(attrs.for)[0];

            function switchVideoState() {
                if (auxData.settings.screenIndex === 0
                    && auxData.settings.currentPage === "index"
                    && auxData.settings.handleScrollEvents) {

                    if (!scope.index.isPlaying) {
                        $('#cinema, header').animate({opacity: 0});
                        video.play();
                        scope.index.isPlaying = true;
                    } else {
                        $('#cinema, header').animate({opacity: 1});
                        video.pause();
                        scope.index.isPlaying = false;
                    }
                }
            }

            function pauseVideo() {
                video.pause();
                scope.index.isPlaying = false;
            }

        }
    }

})(window, window.angular);
