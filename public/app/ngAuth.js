(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAuth',
        [
            'ngRoute',
            'sg.AuthSvc',
            'ui.bootstrap',
            'ui.validate',
            'cgBusy',
            'sg.i18n'

        ])
        .value('cgBusyDefaults', {
            message: 'Загрузка...'
        });

})(window, window.angular);
