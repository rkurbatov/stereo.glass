(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('IndexPage', IndexPage);

    IndexPage.$inject = ['auxData'];
    function IndexPage(auxData) {
        var vm = this;
        vm.settings = auxData.settings;

        vm.getBkSrc = getBkSrc;

        initController();

        // IMPLEMENTATION

        function initController() {
            // reInit screens
            auxData.settings.screenCount = 0;
            auxData.settings.currentPage = 'index';
        }

        function getBkSrc(name) {
            if (auxData.settings.isWideScreen) {
                return auxData.bkImgs[name + '-15-8'].src
            } else {
                return auxData.bkImgs[name + '-15-10'].src
            }
        }

    }

})(window, window.angular);
