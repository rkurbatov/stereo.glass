angular
    .module('sgAppAdmin',
    [
        'smart-table',
        'angularUtils.directives.dirPagination',
        'daterangepicker',
        'ui.bootstrap',
        'ngCookies',
        'hmTouchEvents'
    ])
    .constant('_', window._)        // use lodash as $rootScope constant
    .run(function ($rootScope) {
        $rootScope._ = window._;
    });
