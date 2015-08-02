(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage', [
            'ngCookies',
            'ui.bootstrap',
            'sg.ui'
        ])
        .config(MainPagePlate3dConfig);

    MainPagePlate3dConfig.$inject = ['sgPlate3dOptionsProvider'];

    function MainPagePlate3dConfig(sgPlate3dOptionsProvider) {
        sgPlate3dOptionsProvider.setCustomEvent('carousel:resize');
    }

})(window, window.angular);
