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
            link: link,
            scope: {},
            bindToController: {
                layout: '='
            },
            controller: sgLayoutToolbarController,
            controllerAs: 'toolbar'
        };

        return ddo;

        function link(scope, elm, attrs) {

        }

        function sgLayoutToolbarController() {

            // DECLARATION

            var vm = this;

            vm.isAssignVisible = isAssignVisible;
            vm.isAcceptVisible = isAcceptVisible;
            vm.isUploadVisible = isUploadVisible;
            vm.isDownloadVisible = isDownloadVisible;
            vm.isEditVisible = isEditVisible;
            vm.isRemoveVisible = isRemoveVisible;

            vm.actions = sgLayoutActions;

            var role = sgUsers.currentUser.role;
            var name = sgUsers.currentUser.name;

            // IMPLEMENTATION

            function isAssignVisible() {
                return (role === "admin" || role === "curator")
                    && !vm.layout.status;
            }

            function isAcceptVisible() {
                var assignedToMe = vm.layout.assignedTo === name;
                return role === "designer"
                    && vm.layout.status === "assigned"
                    && assignedToMe;
            }

            function isEditVisible() {
                return vm.layout.createdBy === name
                    || role === 'admin'
                    || role === 'curator';
            }

            function isRemoveVisible() {
                return !vm.layout.status &&
                    (
                        vm.layout.createdBy === name
                        || role === 'admin'
                        || role === 'curator'
                    );
            }

            function isUploadVisible() {
                var assignedToMe = vm.layout.assignedTo === name;
                return role === "designer"
                    && vm.layout.status === "accepted"
                    && assignedToMe;
            }

            function isDownloadVisible() {
                var assignedToMe = vm.layout.assignedTo === name;
                return (
                        (role === 'designer' && assignedToMe)
                        || role === 'admin'
                        || role === 'curator'
                    )
                    && vm.layout.status === 'finished';
            }

        }
    }

})(window, window.angular);