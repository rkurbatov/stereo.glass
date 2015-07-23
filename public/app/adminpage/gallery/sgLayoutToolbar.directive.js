(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgLayoutToolbar', sgLayoutToolbar);

    sgLayoutToolbar.$inject = ['sgUsers', 'sgLayoutActions'];

    function sgLayoutToolbar(sgUsers, sgLayoutActions) {
        var ddo = {
            restrict: 'E',
            templateUrl: '/partials/directive-sgLayoutToolbar',
            scope: {},
            bindToController: {
                layout: '='
            },
            controller: sgLayoutToolbarController,
            controllerAs: 'toolbar'
        };

        sgLayoutToolbarController.$inject = ['$scope'];

        return ddo;

        function sgLayoutToolbarController($scope) {
            // DECLARATION

            var vm = this;

            vm.isAssignVisible = isAssignVisible;
            vm.isReAssignVisible = isReAssignVisible;
            vm.isAcceptVisible = isAcceptVisible;
            vm.isApproveVisible = isApproveVisible;
            vm.isUploadVisible = isUploadVisible;
            vm.isDownloadVisible = isDownloadVisible;
            vm.isEditVisible = isEditVisible;
            vm.isTrashVisible = isTrashVisible;
            vm.isRestoreVisible = isRestoreVisible;

            vm.actions = sgLayoutActions;
            vm.actions.unselectLayout = $scope.$parent.$parent.paginator.unselectLayout;

            var name = sgUsers.currentUser.name;

            // IMPLEMENTATION

            function iAmAdminOrCurator() {
                return _.contains(['admin', 'curator'], sgUsers.currentUser.role);
            }

            function createdByMe() {
                return sgUsers.currentUser.name === vm.layout.createdBy;
            }

            function assignedToMe() {
                return sgUsers.currentUser.name === vm.layout.assignedTo;
            }

            function isAssignVisible() {
                return iAmAdminOrCurator()
                    && (
                        !vm.layout.status
                        || _.contains(['deleted', 'rejected', 'dismissed'], vm.layout.status)
                    );
            }

            function isReAssignVisible() {
                return 'deleted' !== vm.layout.status
                    && _.contains(['assigned', 'accepted'], vm.layout.status)
                    && iAmAdminOrCurator();
            }

            function isAcceptVisible() {
                return 'designer' === sgUsers.currentUser.role
                    && 'assigned' === vm.layout.status
                    && assignedToMe();
            }

            function isApproveVisible() {
                return vm.layout.status === 'finished'
                    && iAmAdminOrCurator();
            }

            function isEditVisible() {
                return createdByMe()
                    || iAmAdminOrCurator();
            }

            function isTrashVisible() {
                return !vm.layout.status
                    && (
                        createdByMe()
                        || iAmAdminOrCurator()
                    );
            }

            function isRestoreVisible() {
                return 'deleted' === vm.layout.status;
            }

            function isUploadVisible() {
                return 'designer' === sgUsers.currentUser.role
                    && 'accepted' === vm.layout.status
                    && assignedToMe();
            }

            function isDownloadVisible() {
                return _.contains(['finished', 'approved'], vm.layout.status)
                    && (
                        ('designer' === sgUsers.currentUser.role && assignedToMe())
                        || iAmAdminOrCurator()
                    );
            }

        }
    }

})(window, window.angular);