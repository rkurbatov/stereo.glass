(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Paginator', Paginator);

    Paginator.$inject = ['sgCategories', 'sgLayouts', 'sgLayoutFilters', 'sgLayoutControls', 'sgUsers', 'sgMessages'];

    function Paginator(sgCategories, sgLayouts, sgLayoutFilters, sgLayoutControls, sgUsers, sgMessages) {

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
        vm.unselectLayout = unselectLayout;
        vm.assignDoer = assignDoer;
        vm.confirmRemove = confirmRemove;

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
            sgUsers.loaded.then(function () {
                vm.authors = sgUsers.authors;
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

        function assignDoer(layout) {
            sgLayoutControls.modalAssignDoer(layout)
                .then(function(response){
                    var setObject = {
                        assignedTo: response.assignedTo,
                        assignedBy: sgUsers.currentUser.name,
                        assignedAt: new Date(),
                        assignedComment: response.comment || "",
                        status: 'assigned'
                    };

                    // TODO: error reporting
                    return sgLayouts.update(layout._id, setObject)
                        .then(function() {
                            _.extend(layout, setObject);
                            var message = {
                                fromUser: setObject.assignedBy,
                                toUser: setObject.assignedTo,
                                type: 'designer',
                                subType: 'jobAssigned',
                                header: 'Новое задание',
                                body: layout._id
                            };
                            return sgMessages.create(message);
                        });
            });
        }

        function confirmRemove(layout) {
            sgLayoutControls.modalRemove(layout)
                .then(function () {
                    sgLayouts.remove(layout).then(function () {
                        vm.unselectLayout();
                        vm.refreshData();
                    });
                });
        }


    }

})();