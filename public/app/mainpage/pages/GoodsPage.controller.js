(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('GoodsPage', GoodsPage);

    GoodsPage.$inject = ['$scope', '$location', 'goodsSvc', 'categoriesSvc'];
    function GoodsPage($scope, $location, goodsSvc, categoriesSvc) {
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

            $scope.$on('$locationChangeSuccess', ()=> {
                openModal();
            });

            goodsSvc.load()
                .then((goods)=> {
                    vm.list = goods.data;
                    openModal()
                });

            categoriesSvc.load()
                .then((categories)=> {
                    vm.categories = categories;
                });
        }

        function getImgUrl(good) {
            return '/uploads/ready/' + good.urlDir + '/' + good.urlThumb;
        }

        function resetFilters() {
            vm.selection.assortment = [];
            vm.selection.colors = [];
            vm.selection.countries = [];
            vm.selection.plots = [];
        }

        function openModal() {
            // reference is part of url, f.e.: /goods/33
            var currentRef = parseInt($location.path().split('/')[2], 10) || null;
            var currentIdx = _.findIndex(vm.list, 'reference', currentRef);

            if (!vm.expandedView && ~currentIdx) { // ~x <=> x !== -1
                vm.expandedView = true;
                goodsSvc
                    .modalExpand(vm.list, currentIdx)
                    .catch(()=> {
                        vm.expandedView = false;
                    });
            }
        }

    }

})(window, window.angular);
