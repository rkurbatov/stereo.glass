(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('GoodsPage', GoodsPage);

    GoodsPage.$inject = ['goodsSvc', 'categoriesSvc'];
    function GoodsPage(goodsSvc, categoriesSvc) {
        var vm = this;

        vm.getImgUrl = getImgUrl;
        vm.resetFilters = resetFilters;

        initController();

        // IMPLEMENTATION

        function initController() {
            vm.list = [];
            vm.selection = {};
            vm.currentPage = 1;
            vm.currentItemsPerPage = 24;

            goodsSvc.load()
                .then((goods)=> {
                    vm.list = goods.data;
                });

            categoriesSvc.load()
                .then((categories)=>{
                    vm.categories = categories;
                });
        }

        function getImgUrl(good) {
            return '/uploads/ready/' + good.urlDir + '/' + good.urlThumb;
        }

        function resetFilters(){
            vm.selection.assortment = [];
            vm.selection.colors = [];
            vm.selection.countries = [];
            vm.selection.plots = [];
        }

    }

})(window, window.angular);
