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
        vm.switchPage = switchPage;


        initController();

        // IMPLEMENTATION

        function initController() {
        }

        function getBkSrc(name) {
            if (auxData.settings.isWideScreen) {
                return auxData.bkImgs[name + '-15-8'].src
            } else {
                return auxData.bkImgs[name + '-15-10'].src
            }
        }

        function switchPage(pageName) {
            if (vm.settings.currentPage === pageName) {
                return
            }

            switch (pageName) {
                case "main":
                case "about":
                case "goods":
                //TODO: animated menu of goods
                case "dealers":
                case "contacts":

            }
            vm.settings.currentPage = pageName;
        }

    }

})(window, window.angular);
