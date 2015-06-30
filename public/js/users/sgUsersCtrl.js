//TODO: search for duplications after editing user
//TODO: delete user sessions after user delete
(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('sgUsersCtrl', sgUsersCtrl);

    sgUsersCtrl.$inject = ['$scope', '$http', '$sce', '$modal', '$cookies', 'sgUsers'];

    function sgUsersCtrl($scope, $http, $sce, $modal, $cookies, sgUsers) {

        $scope.usermail = $cookies.get('usermail') || '';

        $scope.refreshUserData = function () {
            sgUsers.getListOfUsers().then(function (users) {
                $scope.rowCollection = users;
            });
        };

        $scope.refreshUserData();

        $scope.confirmRemove = function (name, id) {
            var modalScope = $scope.$new(true);
            modalScope.text = $sce.trustAsHtml("Вы действительно желаете удалить пользователя <b>" + name + "</b>?");

            var modalInstance = $modal.open({
                templateUrl: '/partials/modalYesNo',
                controller: sgYesNoModalCtrl,
                scope: modalScope,
                size: 'sm'
            });

            modalInstance.result.then(function () {
                $http.delete('/api/users', {
                    params: {'_id': id}
                }).then(function (response) {
                    if (response.status === 200) $scope.refreshUserData();
                });
            });
        };

        $scope.openEditDialog = function (user) {
            var modalScope = $scope.$new(true);
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
            })
        }

    }

})();

