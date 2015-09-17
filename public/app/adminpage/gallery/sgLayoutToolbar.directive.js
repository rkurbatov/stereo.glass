(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgLayoutToolbar', sgLayoutToolbar);

    sgLayoutToolbar.$inject = ['sgUsers', 'sgLayoutActions'];

    function sgLayoutToolbar(sgUsers, sgLayoutActions) {
        var ddo = {
            restrict: 'E',
            templateUrl: '/templates/directive/sgLayoutToolbar',
            scope: {},
            bindToController: {
                layout: '=',
                gallery: '=',
                isCurrent: '='
            },
            controller: sgLayoutToolbarController,
            controllerAs: 'toolbar'
        };

        sgLayoutToolbarController.$inject = [];

        return ddo;

        function sgLayoutToolbarController() {
            // DECLARATION

            var vm = this;

            vm.isAssignVisible = isAssignVisible;
            vm.isReAssignVisible = isReAssignVisible;
            vm.isAcceptVisible = isAcceptVisible;
            vm.isApproveVisible = isApproveVisible;
            vm.isRevertVisible = isRevertVisible;
            vm.isUploadVisible = isUploadVisible;
            vm.isDownloadVisible = isDownloadVisible;
            vm.isEditVisible = isEditVisible;
            vm.isTrashVisible = isTrashVisible;
            vm.isRestoreVisible = isRestoreVisible;
            vm.isPublishedVisible = isPublishedVisible;

            vm.actions = sgLayoutActions;
            vm.actions.unselectLayout = vm.gallery.unselectLayout;

            var curUser = sgUsers.currentUser;

            // IMPLEMENTATION

            function iAmAdminOrCurator() {
                return _.contains(['admin', 'curator'], curUser.role);
            }

            function createdByMe() {
                return curUser.name === vm.layout.createdBy;
            }

            function assignedToMe() {
                return curUser.name === vm.layout.assignedTo;
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
                return 'designer' === curUser.role
                    && 'assigned' === vm.layout.status
                    && assignedToMe();
            }

            function isRevertVisible() {
                return vm.layout.status === 'approved'
                    && iAmAdminOrCurator();
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
                return 'designer' === curUser.role
                    && 'accepted' === vm.layout.status
                    && assignedToMe();
            }

            function isDownloadVisible() {
                return _.contains(['finished', 'approved'], vm.layout.status)
                    && (
                        ('designer' === curUser.role && assignedToMe())
                        || iAmAdminOrCurator()
                    );
            }

            function isPublishedVisible() {
                return 'approved' === vm.layout.status && iAmAdminOrCurator();
            }

        }
    }

})(window, window.angular);