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
        vm.mail = sgUsers.currentUser.mail;
        vm.list = [];
        vm.refreshList = refreshList;

        initController();

        function initController() {
            vm.refreshList();
        }


        function refreshList() {
            sgUsers.getListOfUsers().then(function (users) {
                vm.list = users;
            });
        }


        vm.confirmRemove = function (user) {
            var header = "Удаление пользователя";
            var message = "Вы действительно хотите удалить пользователя <b>" + user.username + "</b>?";

            sgModals.YesNo(header, message)
                .then(function () {
                    return sgUsers.remove(user['_id']);
                })
                .then(function () {
                    refreshList();
                });
        };

        vm.openEditDialog = function (user) {
            sgUserControls.modalEditUser(_.pick(user, ['_id', 'username', 'usermail', 'role']))
                .then(function (modifiedProperties) {
                    sgUsers.update(user['_id'], modifiedProperties)
                        .then(function(){
                            _.merge(user, modifiedProperties);
                        });
                });
        }

    }

})();

