(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgGifPlayer', sgGifPlayer);

    sgGifPlayer.$inject = [];

    function sgGifPlayer() {

        return {
            restrict: 'C',
            scope: {},
            template: '<img ng-click="switchState()" ng-src="{{imgSrc}}"/><i class="fa fa-play-circle-o" ng-click="switchState()" ng-class="{invisible: state !== \'static\'}"></i>',
            link
        };

        function link(scope, elm, attrs) {
            scope.state = 'static';
            scope.imgSrc = attrs.static;
            scope.switchState = function() {
                if (scope.state === 'static') {
                    scope.state = 'anim';
                    scope.imgSrc = attrs.anim;
                } else {
                    scope.state = 'static';
                    scope.imgSrc = attrs.static;
                }
            }
        }
    }

})(window, window.angular);