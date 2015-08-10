(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAuth',
        [
            'ngRoute',
            'sg.AuthSvc',
            'ui.bootstrap',
            'ui.validate',
            'cgBusy'

        ])
        .value('cgBusyDefaults', {
            message: 'Загрузка...'
        });

})(window, window.angular);
