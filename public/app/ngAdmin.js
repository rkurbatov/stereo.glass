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
            'color.picker',
            'LoDash',
            'sgINT',
            'sg.ui'
        ]);

})(window, window.angular);
