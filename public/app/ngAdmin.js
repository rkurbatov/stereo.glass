;(function(window, angular, undefined){
    'use strict';

    angular
        .module('sgAppAdmin',
        [
            'smart-table',
            'angularUtils.directives.dirPagination',
            'daterangepicker',
            'ui.bootstrap',
            'ngCookies',
            'hmTouchEvents',
            'toastr',
            'ngFileUpload',
            'nsPopover'
        ]);

})(window, window.angular);
