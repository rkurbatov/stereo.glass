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
                    return sgUsers.deleteUser(user);
                })
                .then(function () {
                    refreshList();
                });
        };

        vm.openEditDialog = function (user) {
            /*var modalScope = $scope.$new(true);
            modalScope.result = {};
            modalScope.result.username = user.username;
            modalScope.result.usermail = user.usermail;
            modalScope.result.roles = ['admin', 'designer', 'founder', 'user'];
            modalScope.result.role = user.role;

            var modalInstance = $modal.open({
                templateUrl: '/partials/modalEditUser',
                controller: sgYesNoModalCtrl,
                scope: modalScope,
                size: 'sm'
            });

            modalInstance.result.then(function (result) {
                // check for changes
                var changes = {};

                if (user.username !== result.username) changes.username = result.username;
                if (user.usermail !== result.usermail) changes.usermail = result.usermail;
                if (user.role !== result.role) changes.role = result.role;
                if (result.password) changes.password = result.password;

                if (!angular.equals(changes, {})) {
                    // There are changes!
                    $http.put('/api/users/' + user['_id'], JSON.stringify(changes))
                        .then(function () {
                            $scope.refreshUserData();
                        });
                }
            })*/
        }

    }

})();

