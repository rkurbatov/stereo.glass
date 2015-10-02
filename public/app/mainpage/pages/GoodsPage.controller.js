(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('GoodsPage', GoodsPage);

    GoodsPage.$inject = ['$scope', '$location', 'goodsSvc', 'categoriesSvc'];
    function GoodsPage($scope, $location, goodsSvc, categoriesSvc) {
        var vm = this;

        vm.getThumbStatic = getThumbStatic;
        vm.getThumbAnim = getThumbAnim;
        vm.resetFilters = resetFilters;
        vm.openModal = openModalIfExpanded;
        vm.selectionChanged = selectionChanged;

        // hack to prevent loading data on filter change during initialization
        var dontReactOnFilters = true;

        initController();

        // IMPLEMENTATION

        function initController() {
            vm.list = [];
            vm.filtered = [];
            vm.selection = {};
            vm.currentPage = 1;
            vm.currentItemsPerPage = 24;
            vm.ippArray = [12, 24, 48];
            vm.expandedView = false;
            loadCategories();

            $scope.$on('$locationChangeSuccess', openModalIfExpanded);
            $scope.$on('sg-lang-changed', loadCategories);

            refreshData().then(()=> {
                dontReactOnFilters = false;
                openModalIfExpanded();
            });

            function loadCategories() {
                categoriesSvc
                    .load()
                    .then((categories)=> {
                        vm.categories = categories;
                    });
            }

        }

        function getThumbStatic(good) {
            return '/uploads/ready/' + good.urlDir + '/' + good.urlThumbLoRes;
        }

        function getThumbAnim(good) {
            return '/uploads/ready/' + good.urlDir + '/' + good.urlGifLoRes;
        }

        function selectionChanged() {
            if (!dontReactOnFilters) {
                refreshData();
            }
        }

        function resetFilters() {
            dontReactOnFilters = true;
            vm.selection.assortment = [];
            vm.selection.colors = [];
            vm.selection.countries = [];
            vm.selection.plots = [];
            refreshData();
            dontReactOnFilters = false;
        }

        function refreshData() {
            return goodsSvc
                .load(vm.selection)
                .then((goods)=> {
                    vm.list = goods.data;
                });
        }

        function openModalIfExpanded() {
            if (vm.expandedView) return;
            // reference is part of url, f.e.: /goods/33
            var currentRef = parseInt($location.search().ref, 10) || null;
            var currentIdx = _.findIndex(vm.filtered, 'reference', currentRef);

            if (~currentIdx) { // ~x <=> x !== -1
                vm.expandedView = true;
                goodsSvc
                    .modalExpand(vm.filtered, currentIdx)
                    .catch(()=> {
                        vm.expandedView = false;
                        // clear search params on close
                        $location.search('ref', null);
                    });
            }
        }
    }

})(window, window.angular);
