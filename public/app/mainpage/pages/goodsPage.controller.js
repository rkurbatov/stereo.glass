(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('GoodsPage', GoodsPage);

    GoodsPage.$inject = ['auxData', 'goodsSvc'];
    function GoodsPage(auxData, goodsSvc) {
        var vm = this;

        vm.getImgUrl = getImgUrl;

        initController();

        // IMPLEMENTATION

        function initController() {
            vm.list = [];
            vm.currentPage = 1;
            vm.currentItemsPerPage = 24;

            goodsSvc.load()
                .then((goods)=> {
                    vm.list = goods.data;
                });
        }

        function getImgUrl(good) {
            return '/uploads/' + good.urlDir + '/' + good.urlGifLoRes;
        }

    }

})(window, window.angular);
