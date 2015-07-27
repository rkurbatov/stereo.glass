(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage', ['sg.ui'])
        .config(function (sgPlate3dOptionsProvider) {
            sgPlate3dOptionsProvider.setCustomEvent('carousel:resize');
        });

})(window, window.angular);
