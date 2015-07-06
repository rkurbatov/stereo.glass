//TODO: search for duplications after editing user
//TODO: delete user sessions after user delete
(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Users', Users);

    Users.$inject = ['sgUsers', 'sgUserControls', 'sgModals'];

    function Users(sgUsers, sgUserControls, sgModals) {

        var vm = this;
        vm.svcUsers = sgUsers;
        vm.mail = vm.svcUsers.currentUser.mail;

        initController();

        function initController() {

        }


        vm.confirmRemove = function (user) {
            var header = "Удаление пользователя";
            var message = "Вы действительно хотите удалить пользователя <b>" + user.username + "</b>?";

            sgModals.YesNo(header, message)
                .then(function () {
                    return sgUsers.remove(user['_id']);
                })
                .then(function () {
                    vm.svcUsers.reload();
                });
        };

        vm.openEditDialog = function (user) {
            sgUserControls.modalEditUser(_.pick(user, ['_id', 'username', 'usermail', 'role']))
                .then(function (modifiedProperties) {
                    sgUsers.update(user['_id'], modifiedProperties)
                        .then(function () {
                            _.merge(user, modifiedProperties);
                        });
                });
        }

    }

})();

