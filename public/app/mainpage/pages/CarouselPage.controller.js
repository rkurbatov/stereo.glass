(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('CarouselPage', CarouselPage);

    CarouselPage.$inject = ['auxData'];
    function CarouselPage(auxData) {
        var vm = this;
        vm.settings = auxData.settings;

        vm.getBkSrc = getBkSrc;

        initController();

        // IMPLEMENTATION

        function initController() {
            // reInit screens
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
