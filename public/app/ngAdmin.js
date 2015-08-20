(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin',
        [
            'smart-table',
            'angularUtils.directives.dirPagination',
            'daterangepicker',
            'ui.bootstrap',
            'ui.mask',
            'angular-bootstrap-select',
            'ngCookies',
            'hmTouchEvents',
            'toastr',
            'ngFileUpload',
            'nsPopover',
            'color.picker',
            'LoDash',
            'sg.i18n',
            'sg.ui'
        ]);

})(window, window.angular);
