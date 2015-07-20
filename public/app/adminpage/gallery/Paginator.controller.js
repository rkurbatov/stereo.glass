(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Paginator', Paginator);

    Paginator.$inject = ['$scope', 'sgCategories', 'sgLayouts', 'sgLayoutFilters', 'sgLayoutSortOrder', 'sgLayoutModals', 'sgUsers'];

    function Paginator($scope, sgCategories, sgLayouts, sgLayoutFilters, sgLayoutSortOrder, sgLayoutModals, sgUsers) {

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

        vm.getAuthorBorderColor = getAuthorBorderColor;
        vm.getAssigneeBorderColor = getAssigneeBorderColor;

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

            vm.dateRange = {
                startDate: null,
                    endDate: null
            };

            // Watch over datarange change
            $scope.$watch(function () {
                return vm.dateRange;
            }, function (newVal) {
                // convert moment objects to ISO 8601 strings for comparison
                if (newVal.startDate) {
                    vm.dateRange.startDateString = newVal.startDate.toISOString();
                }
                if (newVal.endDate) {
                    vm.dateRange.endDateString = newVal.endDate.toISOString();
                }
            });

            // Change sort order depending on viewMode
            $scope.$watch(
                function () {
                    return vm.viewMode;
                },
                function (mode) {
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
            sgLayoutModals.showInGallery(vm)
        }

        function searchFilter(layout) {
            return !!layout.name.toLowerCase().replace(/[\_\-]/, ' ').match(vm.search.reName);
        }

        function searchUpdate() {
            vm.search.reName = new RegExp(vm.search.string.toLowerCase());
        }

        // Filter by viewMode, status and date range
        function viewModeFilter(layout) {
            switch (vm.viewMode) {
                case "Rating":
                    return (
                            !layout.status
                            && vm.filters.current.Rating.value(layout)   // current rating filter
                        ) && (
                            !vm.dateRange.startDate
                            || vm.dateRange.startDateString < layout.createdAt
                        ) && (
                            !vm.dateRange.endDate
                            || vm.dateRange.endDateString > layout.createdAt
                        );
                case "Progress":
                    return (
                            layout.status
                            && layout.status !== "finished"
                            && vm.filters.current.Progress.value(layout)
                        ) && (
                            !vm.dateRange.startDate
                            || vm.dateRange.startDateString < layout.assignedAt
                        ) && (
                            !vm.dateRange.endDate
                            || vm.dateRange.endDateString > layout.assignedAt
                        );
                case "Ready":
                    return layout.status === "finished"
                        && vm.filters.current.Ready.value(layout)
                        && (
                            !vm.dateRange.startDate
                            || vm.dateRange.startDateString < layout.finishedAt
                        ) && (
                            !vm.dateRange.endDate
                            || vm.dateRange.endDateString > layout.finishedAt
                        );
            }
        }

        function addComment(layout) {
            sgLayoutModals.addLayoutComment(layout)
                .then(function (commentText) {
                    return sgLayouts.addComment(layout, commentText);
                });
        }

        function getAuthorBorderColor(layout) {
            return 'border-color: ' + sgUsers.borderColors[layout.createdBy];
        }

        function getAssigneeBorderColor(layout) {
            return 'border-color: ' + sgUsers.borderColors[layout.assignedTo];
        }

    }

})(window, window.angular);