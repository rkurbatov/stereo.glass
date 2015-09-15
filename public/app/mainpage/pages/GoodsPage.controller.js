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
        vm.openModal = openModal;

        initController();

        // IMPLEMENTATION

        function initController() {
            vm.list = [];
            vm.selection = {};
            vm.currentPage = 1;
            vm.currentItemsPerPage = 24;
            vm.expandedView = false;

            $scope.$on('$locationChangeSuccess', ()=> {
                console.log('on location change');
                openModal();
            });

            goodsSvc.load()
                .then((goods)=> {
                    console.log('on svc load');
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
            if (vm.expandedView) return;
            // reference is part of url, f.e.: /goods/33
            var currentRef = parseInt($location.search().ref, 10) || null;
            var currentIdx = _.findIndex(vm.list, 'reference', currentRef);
            console.log('ref: %s, index: %s', currentRef, currentIdx);

            if (~currentIdx) { // ~x <=> x !== -1
                vm.expandedView = true;
                goodsSvc
                    .modalExpand(vm.list, currentIdx)
                    .catch(()=> {
                        vm.expandedView = false;
                        // clear search params on close
                        $location.search('ref', null);
                    });
            }
        }
    }

})(window, window.angular);
