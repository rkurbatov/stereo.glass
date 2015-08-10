(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage', [
            'ngCookies',
            'ngAnimate',
            'ui.validate',
            'sg.ui',
            'sg.AuthSvc',
            '720kb.fx',
            'cgBusy',
            'sgINT'
        ])
        .config(MainPagePlate3dConfig)
        .value('cgBusyDefaults', {
            message: 'Загрузка...'
        });

    MainPagePlate3dConfig.$inject = ['sgPlate3dOptionsProvider'];

    function MainPagePlate3dConfig(sgPlate3dOptionsProvider) {
        sgPlate3dOptionsProvider.setCustomEvent('carousel:resize');
    }

})(window, window.angular);
