(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage', [
            'ngRoute',
            'ngCookies',
            'ngAnimate',
            'LocalStorageModule',
            'ui.validate',
            'sg.ui',
            'sg.AuthSvc',
            '720kb.fx',
            'cgBusy',
            'sgINT'
        ])
        .config(Plate3dConfig)
        .config(LocalStorageConfig)
        .value('cgBusyDefaults', {
            message: 'Загрузка...'
        });

    Plate3dConfig.$inject = ['sgPlate3dOptionsProvider'];

    function Plate3dConfig(sgPlate3dOptionsProvider) {
        sgPlate3dOptionsProvider.setCustomEvent('carousel:resize');
    }

    LocalStorageConfig.$inject = ['localStorageServiceProvider'];

    function LocalStorageConfig(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('stereo.glass.')
    }

})(window, window.angular);
