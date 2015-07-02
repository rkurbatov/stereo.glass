(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Paginator', Paginator);

    Paginator.$inject = ['sgCategories', 'sgLayouts', 'sgLayoutFilters', 'sgUsers'];

    function Paginator(sgCategories, sgLayouts, sgLayoutFilters, sgUsers) {

        // ==== DECLARATION =====

        var vm = this;

        vm.filters = sgLayoutFilters;
        vm.currentUser = sgUsers.currentUser;
        vm.rawLayouts = sgLayouts.rawLayouts;
        vm.filteredLayouts = [];

        vm.itemsPerPage = [12, 18, 24, 36];
        vm.currentItemsPerPage = 18;
        vm.currentPage = 1;
        vm.$index = -1;
        vm.currentLayoutIndex = -1;

        vm.refreshData = sgLayouts.loadData;
        vm.reset = reset;
        vm.resetAll = resetAll;

        vm.handleLayoutClick = handleLayoutClick;

        initController();

        // === IMPLEMENTATION ===

        function initController() {
            // init paginator


            // form selectors data
            sgCategories.loaded.then(function () {
                vm.assortment = sgCategories.assortment;
                vm.colors = sgCategories.colors;
                vm.countries = sgCategories.countries;
                vm.plots = sgCategories.plots;
            });

            // Fill designers list
            sgUsers.getLayoutAuthors().then(function (authors) {
                // TODO: move arrToOptions to service
                vm.authors = arrToOptions(authors);
            });

            vm.refreshData();
        }

        function reset(category) {
            vm.filters.server[category] = [];
            vm.refreshData();
        }

        function resetAll() {
            angular.forEach(vm.filters.server, function (value, key) {
                vm.filters.server[key] = [];
            });

            vm.refreshData();
        }

        function handleLayoutClick($index) {
            vm.$index = $index;
            vm.currentLayoutIndex = $index + (vm.currentPage - 1) * vm.currentItemsPerPage;
            vm.currentLayout = vm.filteredLayouts[vm.currentLayoutIndex];
        }


    }

})();