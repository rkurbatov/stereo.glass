(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAuth')
        .service('ResetSvc', ResetSvc);

    ResetSvc.$inject = ['$modal'];

    function ResetSvc($modal) {
        var svc = this;
        svc.modalResetPassword = modalResetPassword;
        svc.modalBadToken = modalBadToken;

        function modalResetPassword(token) {
            var modalDO = {
                templateUrl: '/partials/modal-resetPassword',
                controller: modalResetCtrl,
                controllerAs: 'vm',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    token: function () {
                        return token
                    }
                },
                size: 'sm'
            };

            return $modal.open(modalDO).result;
        }

        function modalBadToken() {
            var modalDO = {
                templateUrl: '/partials/modal-badToken',
                controller: modalBadTokenCtrl,
                controllerAs: 'vm',
                backdrop: 'static',
                keyboard: false,
                resolve: {},
                size: 'sm'
            };

            return $modal.open(modalDO).result;
        }

    }

    modalResetCtrl.$inject = ['$modalInstance', '$http', 'token'];

    function modalResetCtrl($modalInstance, $http, token) {
        var vm = this;
        vm.password = '';

        vm.resetPassword = function () {
            $http
                .post('/auth/reset-password/' + token, {password: vm.password})
                .then(function (response) {
                    $modalInstance.close(response);
                    $window.location = '/auth/';
                })
                .catch(function(err){
                    $modalInstance.dismiss(err);
                    $window.location = '/auth/';
                })

        }
    }

    modalBadTokenCtrl.$inject = ['$modalInstance', '$window'];

    function modalBadTokenCtrl($modalInstance, $window) {
        var vm = this;
        vm.close = function () {
            $modalInstance.dismiss();
            $window.location = '/auth/';
        }
    }

})(window, window.angular);
