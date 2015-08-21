(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('GoodsPage', GoodsPage);

    GoodsPage.$inject = ['auxData', 'goodsSvc'];
    function GoodsPage(auxData, goodsSvc) {
        var vm = this;
        vm.list = [];
        vm.currentPage = 1;
        vm.currentItemsPerPage = 24;

        initController();

        // IMPLEMENTATION

        function initController() {
            goodsSvc.load()
                .then((goods)=> {
                    vm.list = goods.data;
                });
        }

    }

})(window, window.angular);
