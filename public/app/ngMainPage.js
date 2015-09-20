(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage', [
            'ngRoute',
            'ngCookies',
            'ngAnimate',
            'angularUtils.directives.dirPagination',
            'angular-click-outside',
            'angular-bootstrap-select',
            'uiGmapgoogle-maps',
            'LocalStorageModule',
            'LoDash',
            'ui.validate',
            'sg.ui',
            'sg.i18n',
            'sg.AuthSvc',
            '720kb.fx',
            'cgBusy'
        ])
        .config(Plate3dConfig)
        .config(LocalStorageConfig)
        .config(googleMapsConfig)
        .value('cgBusyDefaults', {
            message: 'Загрузка...'
        });

    Plate3dConfig.$inject = ['sgPlate3dOptionsProvider'];

    function Plate3dConfig(sgPlate3dOptionsProvider) {
        sgPlate3dOptionsProvider.setCustomEvent('carousel:redraw');
    }

    LocalStorageConfig.$inject = ['localStorageServiceProvider'];

    function LocalStorageConfig(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('stereo.glass.')
    }

    googleMapsConfig.$inject = ['uiGmapGoogleMapApiProvider'];

    function googleMapsConfig(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
    }

})(window, window.angular);
