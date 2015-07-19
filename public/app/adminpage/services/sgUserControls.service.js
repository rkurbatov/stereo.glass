(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgUserControls', sgUserControls);

    sgUserControls.$inject = ['$modal', 'sgUsers'];

    function sgUserControls($modal, sgUsers) {
        var vm = this;
        vm.modalEditUser = modalEditUser;

        function modalEditUser(user) {
            var modalDO = {
                templateUrl: '/partials/modal-EditUser',
                controller: editUserCtrl,
                controllerAs: 'vm',
                resolve: {
                    user: function () {
                        return user
                    }
                },
                size: 'sm'
            };

            return $modal.open(modalDO).result;
        }

        editUserCtrl.$inject = ['$modalInstance', 'sgUsers', 'user'];

        function editUserCtrl($modalInstance, sgUsers, user) {
            var vm = this;
            vm.user = user;
            vm.newPassword = '';
            vm.roles = sgUsers.allRoles;
            vm.borderColor = vm.user.borderColor || "rgb(255, 255, 255)";

            vm.ok = function () {
                if (vm.borderColor !== "rgb(255, 255, 255") {
                    vm.user.borderColor = vm.borderColor;
                }
                if (vm.newPassword) {
                    vm.user.password = vm.newPassword;
                }
                $modalInstance.close(vm.user);
            };

            vm.cancel = function () {
                $modalInstance.dismiss('cancel');
            }
        }

    }

})(window, window.angular);