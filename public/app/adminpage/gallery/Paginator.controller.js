(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Paginator', Paginator);

    Paginator.$inject = ['$scope', 'sgCategories', 'sgLayouts', 'sgLayoutFilters', 'sgLayoutControls', 'sgUsers', 'sgMessages', '$q'];

    function Paginator($scope, sgCategories, sgLayouts, sgLayoutFilters, sgLayoutControls, sgUsers, sgMessages, $q) {

        // ==== DECLARATION =====

        var vm = this;

        vm.viewMode = "Rating";

        vm.filters = sgLayoutFilters;
        vm.currentUser = sgUsers.currentUser;
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
        vm.resetAll = resetAll;

        vm.getAssignmentClass = getAssignmentClass;
        vm.getAssignmentVisibility = getAssignmentVisibility;
        vm.getThumbClass = getThumbClass;
        vm.getThumbUrl = sgLayouts.getThumbUrl;

        vm.handleLayoutClick = handleLayoutClick;
        vm.showInGallery = showInGallery;
        vm.unselectLayout = unselectLayout;
        vm.changeStatus = changeStatus;
        vm.confirmRemove = confirmRemove;

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
            $scope.$watch(function(){
                return vm.filters.dateRange;
            }, function(newVal, oldVal){
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

        function resetAll() {
            angular.forEach(vm.filters.server, function (value, key) {
                vm.filters.server[key] = [];
            });
            vm.filters.dateRange.startDate = null;
            vm.filters.dateRange.endDate = null;
            if (vm.search.string) {
                vm.search.string = '';
                vm.search.update();
            }
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

        function getAssignmentClass(status) {
            switch (status) {
                case "assigned":
                    return "sg-silver-i fa-check-square-o";
                case "accepted":
                    return "sg-yellow-i fa-upload";
                case undefined:
                default:
                    return "sg-blue-i fa-check-square-o";
            }
        }

        function getAssignmentVisibility(role, layout) {
            var status = layout.status;
            var assignedToMe = layout.assignedTo === sgUsers.currentUser.name;
            return ((role === "admin" || role === "curator") && !status)
                || (role === "designer" && (status === "assigned" || status === "accepted") && assignedToMe);
        }

        function changeStatus(layout) {
            switch (layout.status) {
                case "assigned":
                    acceptLayout(layout);
                    break;
                case "accepted":
                    finishJob(layout);
                    break;
                case undefined:
                default:
                    assignDoer(layout);
            }
        }

        function showInGallery() {
            sgLayoutControls.modalGallery(vm)
        }

        function assignDoer(layout) {
            sgLayoutControls.modalAssignDoer(layout)
                .then(function (response) {
                    var setObject = {
                        assignedTo: response.assignedTo,
                        assignedBy: sgUsers.currentUser.name,
                        assignedAt: new Date(),
                        assignedComment: response.comment || "",
                        status: 'assigned'
                    };

                    // TODO: error reporting
                    // don't forget to destroy listeners on close
                    return sgLayouts.update(layout._id, setObject)
                        .then(function (result) {
                            if (result.data && result.data.layout) {
                                layout.reference = result.data.layout.reference;
                                layout.urlDir = result.data.layout.urlDir;
                            }
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
                        })
                        .then(function () {
                            if (response.sendEmail) {
                                var mail = {
                                    to: sgUsers.getMail(setObject.assignedTo),
                                    subject: "Новое задание",
                                    template: 'designer-newTask'
                                };

                                var vars = {
                                    sender: sgUsers.currentUser.name,
                                    comment: setObject.assignedComment
                                };
                                return sgMessages.eMail(mail, vars);
                            }
                        });
                });
        }

        function acceptLayout(layout) {
            sgLayoutControls.modalAccept(layout)
                .then(function (response) {
                    var setObject = {
                        status: response.rejected
                            ? "rejected"
                            : "accepted",
                        acceptedDate: new Date(),
                        acceptedComment: response.comment
                    };
                    sgLayouts.update(layout._id, setObject)
                        .then(function () {
                            _.extend(layout, setObject);
                            var designerMessage = {
                                fromUser: "Stereo.Glass",
                                toUser: layout.assignedTo,
                                type: 'designer',
                                subType: 'jobAssigned',
                                header: 'Задание принято вами в работу',
                                body: layout._id
                            };

                            var adminMessage = {
                                fromUser: layout.assignedTo,
                                toUser: layout.assignedBy,
                                type: 'designer',
                                subType: 'jobAccepted',
                                header: 'Задание принято ' + layout.assignedTo + ' в работу',
                                body: layout._id
                            };

                            return $q.all([sgMessages.create(designerMessage), sgMessages.create(adminMessage)]);
                        });
                });

        }

        function finishJob(layout) {
            sgLayoutControls.modalFinishJob(layout)
                .then(function (response) {
                    var setObject = {
                        status: 'finished',
                        responseComment: response.comment
                    };
                    sgLayouts.update(layout._id, setObject)
                        .then(function(){
                            _.extend(layout, setObject);
                            var adminMessage = {
                                fromUser: layout.assignedTo,
                                toUser: layout.assignedBy,
                                type: 'designer',
                                subType: 'jobFinished',
                                header: layout.assignedTo + ' завершил работу над макетом',
                                body: layout._id
                            };
                            sgMessages.create(adminMessage);
                        });
                });
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

        function confirmRemove(layout) {
            sgLayoutControls.modalRemove(layout)
                .then(function () {
                    sgLayouts.remove(layout['_id']).then(function () {
                        vm.unselectLayout();
                        layout.isHidden = true;
                    });
                });
        }

        function getThumbClass(layout) {
            return layout.status
                ? 'sg-border-' + layout.status
                : '';
        }

    }

})();