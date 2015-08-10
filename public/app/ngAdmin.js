(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin',
        [
            'smart-table',
            'angularUtils.directives.dirPagination',
            'daterangepicker',
            'ui.bootstrap',
            'angular-bootstrap-select',
            'ngCookies',
            'hmTouchEvents',
            'toastr',
            'ngFileUpload',
            'nsPopover',
            'color.picker'
        ])
        .constant('_', window._)        // use lodash as $rootScope constant
        .run(LoDashProvider);

    LoDashProvider.$inject = ['$rootScope'];
    function LoDashProvider($rootScope) {
        $rootScope._ = window._;
    }

})(window, window.angular);
