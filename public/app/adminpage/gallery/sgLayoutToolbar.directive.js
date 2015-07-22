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
            vm.isAcceptVisible = isAcceptVisible;
            vm.isApproveVisible = isApproveVisible;
            vm.isUploadVisible = isUploadVisible;
            vm.isDownloadVisible = isDownloadVisible;
            vm.isEditVisible = isEditVisible;
            vm.isTrashVisible = isTrashVisible;
            vm.isRestoreVisible = isRestoreVisible;

            vm.actions = sgLayoutActions;
            vm.actions.unselectLayout = $scope.$parent.$parent.paginator.unselectLayout;

            var role = sgUsers.currentUser.role;
            var name = sgUsers.currentUser.name;

            // IMPLEMENTATION

            function isAssignVisible() {
                return !vm.layout.isHidden
                    && !vm.layout.status
                    && (
                        role === 'admin'
                        || role === 'curator'
                    );
            }

            function isAcceptVisible() {
                var assignedToMe = vm.layout.assignedTo === name;
                return role === 'designer'
                    && vm.layout.status === 'assigned'
                    && assignedToMe;
            }

            function isApproveVisible() {
                return !vm.layout.isHidden
                    && vm.layout.status === 'finished'
                    && (role === 'admin'
                    || role === 'curator');
            }

            function isEditVisible() {
                return !vm.layout.isHidden
                    && (
                        vm.layout.createdBy === name
                        || role === 'admin'
                        || role === 'curator'
                    );
            }

            function isTrashVisible() {
                return !vm.layout.status
                    && !vm.layout.isHidden
                    && (
                        vm.layout.createdBy === name
                        || role === 'admin'
                        || role === 'curator'
                    );
            }

            function isRestoreVisible() {
                return vm.layout.isHidden;
            }

            function isUploadVisible() {
                var assignedToMe = vm.layout.assignedTo === name;
                return role === 'designer'
                    && vm.layout.status === 'accepted'
                    && assignedToMe;
            }

            function isDownloadVisible() {
                var assignedToMe = vm.layout.assignedTo === name;
                return (
                        (role === 'designer' && assignedToMe)
                        || role === 'admin'
                        || role === 'curator'
                    )
                    && (
                        vm.layout.status === 'finished'
                        || vm.layout.status === 'approved'
                    );
            }

        }
    }

})(window, window.angular);