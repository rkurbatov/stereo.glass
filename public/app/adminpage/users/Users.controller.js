(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Users', Users);

    Users.$inject = ['sgUsers', 'sgUserControls', 'sgModals'];

    function Users(sgUsers, sgUserControls, sgModals) {

        var vm = this;
        vm.svcUsers = sgUsers;
        vm.mail = vm.svcUsers.currentUser.mail;
        vm.confirmRemove = confirmRemove;
        vm.openEditDialog = openEditDialog;

        // IMPLEMENTATION

        function confirmRemove(user) {
            var header = "Удаление пользователя";
            var message = "Вы действительно хотите удалить пользователя <b>" + user.username + "</b>?";

            sgModals.YesNo(header, message)
                .then(function () {
                    return sgUsers.remove(user['_id']);
                })
                .then(function () {
                    vm.svcUsers.reload();
                });
        }

        // TODO: Check for pristine form
        function openEditDialog(user) {
            sgUserControls.modalEditUser(user)
                .then(function (modifiedProperties) {
                    sgUsers.update(user['_id'], modifiedProperties)
                        .then(function () {
                            _.merge(user, modifiedProperties);
                            if (modifiedProperties.borderColor) {
                                sgUsers.borderColors[user.username] = modifiedProperties.borderColor;
                            }
                        });
                });
        }

    }

})(window, window.angular);

