(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Paginator', Paginator);

    Paginator.$inject = ['$scope', 'sgCategories', 'sgLayouts', 'sgLayoutFilters', 'sgLayoutControls', 'sgUsers'];

    function Paginator($scope, sgCategories, sgLayouts, sgLayoutFilters, sgLayoutControls, sgUsers) {

        // ==== DECLARATION =====

        var vm = this;

        vm.viewMode = "Rating";

        vm.filters = sgLayoutFilters;
        vm.rawLayouts = sgLayouts.rawLayouts;
        vm.filteredLayouts = [];

        vm.itemsPerPage = [12, 18, 24, 36];
        vm.currentItemsPerPage = 18;
        vm.currentPage = 1;
        vm.$index = -1;
        vm.currentLayoutIndex = -1;

        vm.search = {
            filter: searchFilter,
            string: '',
            reName: new RegExp(''),
            update: searchUpdate
        };

        vm.viewModeFilter = viewModeFilter;

        vm.refreshData = sgLayouts.loadData;
        vm.reset = reset;
        vm.resetDateRange = resetDateRange;
        vm.resetSearch = resetSearch;
        vm.resetAll = resetAll;

        vm.getThumbUrl = sgLayouts.getThumbUrl;
        vm.addComment = addComment;

        vm.handleLayoutClick = handleLayoutClick;
        vm.addComment = addComment;
        vm.showInGallery = showInGallery;
        vm.unselectLayout = unselectLayout;

        initController();

        // === IMPLEMENTATION ===

        function initController() {
            // init paginator
            vm.dateRangeOptions = {
                todayHighlight: true,
                format: 'DD.MM.YY',
                maxDate: moment(),
                language: 'ru',
                locale: {
                    applyClass: 'btn-green',
                    applyLabel: "Применить",
                    fromLabel: "С",
                    toLabel: "по",
                    cancelLabel: 'Отмена',
                    customRangeLabel: 'Другой интервал'
                },
                ranges: {
                    'Всё время': ['01.01.15', moment()],
                    'Сегодня': [moment(), moment()],
                    'Вчера и сегодня': [moment().subtract(1, 'days'), moment()],
                    'Неделя': [moment().subtract(6, 'days'), moment()],
                    'Месяц': [moment().subtract(1, 'month'), moment()]
                }
            };

            // form selectors data
            sgCategories.loaded.then(function () {
                vm.assortment = sgCategories.assortment;
                vm.colors = sgCategories.colors;
                vm.countries = sgCategories.countries;
                vm.plots = sgCategories.plots;
            });

            // Fill designers list
            sgUsers.loaded.then(function () {
                vm.authors = sgUsers.authors;
            });

            // Watch over datarange change
            $scope.$watch(function () {
                return vm.filters.dateRange;
            }, function (newVal, oldVal) {
                if (newVal.startDate && newVal.endDate) {
                    vm.refreshData();
                }
            });

            // Initial data load
            vm.refreshData();
        }

        function reset(category) {
            vm.filters.server[category] = [];
            vm.refreshData();
        }

        function resetDateRange() {
            vm.filters.dateRange.startDate = null;
            vm.filters.dateRange.endDate = null;
            vm.refreshData()
        }

        function resetSearch() {
            console.log('click');
            if (vm.search.string) {
                vm.search.string = '';
                vm.search.update();
            }
        }

        function resetAll() {
            angular.forEach(vm.filters.server, function (value, key) {
                vm.filters.server[key] = [];
            });
            vm.resetDateRange();
            vm.resetSearch();
            vm.unselectLayout();
            vm.refreshData();
        }

        function handleLayoutClick($index) {
            vm.$index = $index;
            vm.currentLayoutIndex = $index + (vm.currentPage - 1) * vm.currentItemsPerPage;
            vm.currentLayout = vm.filteredLayouts[vm.currentLayoutIndex];
        }

        function unselectLayout() {
            vm.$index = -1;
            vm.currentLayoutIndex = -1;
        }

        function showInGallery() {
            sgLayoutControls.modalGallery(vm)
        }

        function searchFilter(layout) {
            return !!layout.name.toLowerCase().replace(/[\_\-]/, ' ').match(vm.search.reName);
        }

        function searchUpdate() {
            vm.search.reName = new RegExp(vm.search.string.toLowerCase());
        }

        function viewModeFilter(layout) {
            switch (vm.viewMode) {
                case "Rating":
                    return !layout.status && vm.filters.currentRating.value(layout);
                case "Progress":
                    return layout.status && layout.status !== "finished" && vm.filters.currentProgress.value(layout);
                case "Ready":
                    return layout.status === "finished";
            }
        }

        function addComment(layout) {
            sgLayoutControls.modalAddLayoutComment(layout)
                .then(function (commentText) {
                    return sgLayouts.addComment(layout, commentText);
                });
        }

    }

})(window, window.angular);