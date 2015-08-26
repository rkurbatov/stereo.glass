(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('DealersPage', DealersPage);

    DealersPage.$inject = ['auxData'];
    function DealersPage(auxData) {
        var vm = this;

        initController();

        // IMPLEMENTATION

        function initController() {

        }

    }

})(window, window.angular);
