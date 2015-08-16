(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('GoodsPage', GoodsPage);

    GoodsPage.$inject = ['auxData'];
    function GoodsPage(auxData) {
        var vm = this;

        initController();

        // IMPLEMENTATION

        function initController() {
            auxData.settings.currentPage = 'goods';
        }

    }

})(window, window.angular);
