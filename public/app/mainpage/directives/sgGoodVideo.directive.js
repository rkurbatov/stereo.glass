(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgGoodVideo', sgGoodVideo);

    sgGoodVideo.$inject = [];

    function sgGoodVideo() {

        return {
            restrict: 'E',
            scope: {
                layout: '=',
                viewMode: '='
            },
            templateUrl: '/templates/directive/sgGoodVideo',
            link
        };

        function link(scope, elm, attrs) {
            scope.getPosterUrl = getPosterUrl;
            scope.getVideoUrl = getVideoUrl;
            scope.play = play();
            scope.pause = pause();

            scope.$watch('viewMode', (newVM)=>{
                if (newVM) {
                    if (newVM === '2D') pause();
                    if (newVM === '3D') play();
                }
            });

            function getPosterUrl() {
                return `/uploads/ready/${scope.layout.urlDir}/${scope.layout.urlStaticHiRes}`;
            }

            function getVideoUrl() {
                return `/uploads/ready/${scope.layout.urlDir}/${scope.layout.urlVideoHiRes}`;
            }

            function play() {
                elm.children()[0].play();
            }

            function pause() {
                elm.children()[0].pause();
            }
        }
    }

})(window, window.angular);