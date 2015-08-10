(function (window, angular, undefined) {
    'use strict';

    angular
        .module('LoDash', [])
        .constant('_', window._)      // use lodash as $rootScope constant
        .run(LoDashProvider);

    LoDashProvider.$inject = ['$rootScope'];
    function LoDashProvider($rootScope) {
        $rootScope._ = window._;
    }

})(window, window.angular);
