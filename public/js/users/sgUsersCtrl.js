function sgUsersCtrl($scope, $http, $sce, $modal, $cookies) {
    'use strict';

    $scope.usermail = $cookies.usermail || '';

    $scope.loadData = function () {
        $http.get('/api/users').then(function (response) {
            $scope.rowCollection = response.data;
        });
    };

    $scope.loadData();

    $scope.confirmRemove = function(name, id) {
        var modalScope = $scope.$new(true);
        modalScope.text = $sce.trustAsHtml("Вы действительно желаете удалить пользователя <b>" + name + "</b>?");

        var modalInstance = $modal.open({
            templateUrl : '/partials/modalYesNo',
            controller : sgYesNoModalCtrl,
            scope : modalScope,
            size : 'sm'
        });

        modalInstance.result.then(function(){
            $http.delete('/api/users', {
                params: {'_id': id}
            }).then(function (response) {
                if (response.status === 200) $scope.loadData();
            });
        });
    }

    $scope.openEditDialog = function(user) {
        var modalScope = $scope.$new(true);
        modalScope.username = user.username;
        modalScope.usermail = user.usermail;
        modalScope.roles = ['admin', 'designer', 'founder', 'user'];
        modalScope.role = user.role;

        var modalInstance = $modal.open({
            templateUrl : '/partials/modalEditUser',
            controller : sgYesNoModalCtrl,
            scope : modalScope,
            size : 'sm'
        });
    }
}