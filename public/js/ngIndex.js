angular.module('SGApp', ['sg.ui'])
    .controller('LoaderCtrl', ['sgPreloader', LoaderCtrl])
    .controller('SGMainCtrl', ['$scope', SGMainCtrl])
    .directive('sgVideoOverlay', sgVideoOverlay);

function sgVideoOverlay() {
    return {
        restrict: 'C',
        template: '<div style="width: 100%; height: 100%;" ng-click="switchVideoState()"></div>',
        link: function (scope, elm, attrs) {
            var video = angular.element('#' + attrs.for)[0] || angular.element(attrs.for)[0];
            scope.isPlaying = false;

            scope.switchVideoState = function () {
                if (!scope.isPlaying) {
                    $('#cinema').animate({opacity: 0});
                    video.play();
                    scope.isPlaying = true;
                } else {
                    $('#cinema').animate({opacity: 1});
                    video.pause();
                    scope.isPlaying = false;
                }
            };

            scope.pauseVideo = function () {
                video.pause();
                scope.isPlaying = false;
            };

        }
    }
}

function SGMainCtrl($scope) {
    'use strict';

    var vm = this;
    vm.coords = {
        clock: [[817, 115], [973, 103], [973, 263], [817, 262]],
        buddah: [[-2, 77], [338, 125], [338, 383], [-2, 426]]
    };
}