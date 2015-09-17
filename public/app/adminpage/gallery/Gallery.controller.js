(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Gallery', Gallery);

    Gallery.$inject = ['$scope', 'sgCategories', 'sgLayouts', 'sgLayoutFilters', 'sgLayoutSortOrder', 'sgLayoutModals', 'sgUsers'];

    function Gallery($scope, sgCategories, sgLayouts, sgLayoutFilters, sgLayoutSortOrder, sgLayoutModals, sgUsers) {

        // ==== DECLARATION =====

        var vm = this;

        vm.viewMode = "Rating";

        vm.filters = sgLayoutFilters;
        vm.sortOrder = sgLayoutSortOrder;
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
            reRef: new RegExp(''),
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

        vm.getAuthorBorderColor = getAuthorBorderColor;
        vm.getAssigneeBorderColor = getAssigneeBorderColor;
        vm.getCommenterTextColor = getCommenterTextColor;

        vm.handleLayoutClick = handleLayoutClick;
        vm.openCarousel = openCarousel;
        vm.unselectLayout = unselectLayout;

        initController();

        // === IMPLEMENTATION ===

        function initController() {
            // init gallery
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
                    cancelLabel: _INT('Отмена'),
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
            sgCategories.loaded.then(() => {
                vm.assortment = sgCategories.assortment;
                vm.colors = sgCategories.colors;
                vm.countries = sgCategories.countries;
                vm.plots = sgCategories.plots;
            });

            vm.dateRange = {
                startDate: null,
                endDate: null
            };

            // Watch over datarange change
            $scope.$watch(() => vm.dateRange, function (newVal) {
                // convert moment objects to ISO 8601 strings for comparison
                if (newVal.startDate) {
                    vm.dateRange.startDateString = newVal.startDate.toISOString();
                }
                if (newVal.endDate) {
                    vm.dateRange.endDateString = newVal.endDate.toISOString();
                }
            });

            // Change sort order depending on viewMode
            $scope.$watch(() => {
                    return vm.viewMode
                },
                (mode) => {
                    vm.sortOrder.current = vm.sortOrder[mode][0];
                    vm.filters.current[mode] = vm.filters[mode][0];
                }
            );

            // Initial data load
            vm.refreshData();
        }

        function reset(category) {
            vm.filters.server[category] = [];
            vm.refreshData();
        }

        function resetDateRange() {
            vm.dateRange.startDate = null;
            vm.dateRange.endDate = null;
        }

        function resetSearch() {
            if (vm.search.string) {
                vm.search.string = '';
                vm.search.update();
            }
        }

        function resetAll() {
            angular.forEach(vm.filters.server, (value, key)=> {
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

        function openCarousel($index) {
            handleLayoutClick($index);
            sgLayoutModals.openCarousel(vm)
        }

        function searchFilter(layout) {
            return 'Rating' === vm.viewMode
                ? !!layout.name.toLowerCase().replace(/[\_\-]/, ' ').match(vm.search.reName)
                : !!String(layout.reference).match(vm.search.reName);
        }

        function searchUpdate() {
            vm.search.reName = new RegExp(vm.search.string.toLowerCase());
        }

        // Filter by viewMode, status and date range
        function viewModeFilter(layout) {
            switch (vm.viewMode) {
                case "Rating":
                    return (!layout.status
                            || _.contains(['deleted', 'rejected', 'dismissed'], layout.status)
                        ) && (
                            !vm.dateRange.startDate
                            || vm.dateRange.startDateString < layout.createdAt
                        ) && (
                            !vm.dateRange.endDate
                            || vm.dateRange.endDateString > layout.createdAt
                        ) && vm.filters.current.Rating.value(layout);   // current rating filter
                case "Progress":
                    return _.contains(['assigned', 'accepted'], layout.status)
                        && (
                            !vm.dateRange.startDate
                            || vm.dateRange.startDateString < layout.assignedAt
                        ) && (
                            !vm.dateRange.endDate
                            || vm.dateRange.endDateString > layout.assignedAt
                        ) && vm.filters.current.Progress.value(layout);
                case "Ready":
                    return _.contains(['finished', 'approved'], layout.status)
                        && (
                            !vm.dateRange.startDate
                            || vm.dateRange.startDateString < layout.finishedAt
                        ) && (
                            !vm.dateRange.endDate
                            || vm.dateRange.endDateString > layout.finishedAt
                        ) && vm.filters.current.Ready.value(layout);
                case "Shop":
                    return "approved" === layout.status
                        && (
                            !vm.dateRange.startDate
                            || vm.dateRange.startDateString < layout.finishedAt
                        ) && (
                            !vm.dateRange.endDate
                            || vm.dateRange.endDateString > layout.finishedAt
                        ) && vm.filters.current.Shop.value(layout);
            }
        }

        function getAuthorBorderColor(layout) {
            return {'border-color': sgUsers.borderColors[layout.createdBy]};
        }

        function getAssigneeBorderColor(layout) {
            return {'border-color': sgUsers.borderColors[layout.assignedTo]};
        }

        function getCommenterTextColor(user) {
            return {'color': sgUsers.borderColors[user] || '#23527c'};
        }

    }

})(window, window.angular);