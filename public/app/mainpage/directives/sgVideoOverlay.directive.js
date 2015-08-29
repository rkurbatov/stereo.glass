(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgVideoOverlay', sgVideoOverlay);

    sgVideoOverlay.$inject = ['$window', 'localStorageService', 'auxData'];

    function sgVideoOverlay($window, localStorageService, auxData) {

        return {
            restrict: 'C',
            template: '<div style="width: 100%; height: 100%;" ng-click="switchVideoState()"></div>',
            link
        };

        function link(scope, elm, attrs) {
            scope.switchVideoState = switchVideoState;

            auxData.settings.isVideoPlaying = false;

            // keypress handler
            angular.element($window).on('keypress', spaceHandler);

            scope.$on('$destroy', ()=> angular.element($window).off('keypress', spaceHandler));

            // First play
            scope.$watch(
                ()=> {
                    return auxData.settings.isLoaded;
                },
                (isLoaded)=> {
                    if (isLoaded
                        && !auxData.settings.isVideoPlaying
                        && !localStorageService.get('videoHasBeenPlayed')) {
                        switchVideoState();
                        localStorageService.set('videoHasBeenPlayed', true);
                    }
                }
            );

            scope.$watch(
                ()=> {
                    return auxData.settings.screenIndex;
                },
                (index)=> {
                    if (index && auxData.settings.isVideoPlaying) switchVideoState();
                }
            );

            var video = angular.element(attrs.for)[0];

            function switchVideoState() {
                if (auxData.settings.handleScrollEvents) {

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

            function spaceHandler(event) {
                if (event.keyCode === 0 || event.keyCode === 32) {
                    switchVideoState();
                }
            }

        }
    }

})(window, window.angular);
