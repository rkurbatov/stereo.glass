(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgVideoOverlay', sgVideoOverlay);

    sgVideoOverlay.$inject = ['$window', '$timeout', 'localStorageService', 'auxData'];

    function sgVideoOverlay($window, $timeout, localStorageService, auxData) {

        return {
            restrict: 'C',
            template: '<div style="width: 100%; height: 100%;" ng-click="switchVideoState()"></div>',
            link: link
        };

        function link(scope, elm, attrs) {
            auxData.settings.isVideoPlaying = false;
            scope.switchVideoState = switchVideoState;
            scope.pauseVideo = pauseVideo;

            angular.element($window).on('keypress', function (e) {
                if (e.keyCode == 0 || e.keyCode == 32) {
                    scope.switchVideoState();
                }
            });

            angular.element($window).on('carousel:scroll', function (e) {
                if (auxData.settings.isVideoPlaying && e.index !== 0) {
                    scope.switchVideoState();
                }
            });

            scope.$watch(
                ()=> {
                    return auxData.settings.isLoaded;
                },
                (isLoaded)=> {
                    if (isLoaded
                        && !auxData.settings.isVideoPlaying
                        && !localStorageService.get('videoHasBeenPlayed')) {
                        $timeout(switchVideoState, 500);
                        localStorageService.set('videoHasBeenPlayed', true);
                    }
                }
            );

            var video = angular.element('#' + attrs.for)[0] || angular.element(attrs.for)[0];

            function switchVideoState() {
                if (auxData.settings.screenIndex === 0
                    && auxData.settings.currentPage === "index"
                    && auxData.settings.handleScrollEvents) {

                    if (!auxData.settings.isVideoPlaying) {
                        $('#cinema, header').animate({opacity: 0});
                        video.play();
                        auxData.settings.isVideoPlaying = true;
                    } else {
                        $('#cinema, header').animate({opacity: 1});
                        video.pause();
                        auxData.settings.isVideoPlaying = false;
                    }
                }
            }

            function pauseVideo() {
                video.pause();
                auxData.settings.isVideoPlaying = false;
            }

        }
    }

})(window, window.angular);
