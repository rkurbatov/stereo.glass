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
            template: `
            <img ng-click="switchState()"
            ng-src="{{imgSrc}}" sg-on-img-load="endSwitchState()"/>
            <i class="fa fa-play-circle-o"
            ng-click="switchState()"
            ng-class="{invisible: state !== 'static'}"></i>
            <i class="fa fa-spinner fa-pulse"
            ng-class="{invisible: state !== 'loading'}"></i>
            `,
            link
        };

        function link(scope, elm, attrs) {
            var nextState = 'static';
            scope.state = 'loading';
            scope.imgSrc = attrs.static;
            scope.nextState = 'static';

            scope.switchState = function () {
                if (scope.state === 'static') {
                    scope.nextState = 'anim';
                    scope.imgSrc = attrs.anim;
                } else {
                    scope.nextState = 'static';
                    scope.imgSrc = attrs.static;
                }
                scope.state = 'loading';
            };
            scope.endSwitchState = function () {
                scope.state = nextState;
            };
        }
    }

})(window, window.angular);