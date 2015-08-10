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

        function modalResetPassword() {
            var modalDO = {
                templateUrl: '/partials/modal-resetPassword',
                controller: modalResetCtrl,
                controllerAs: 'vm',
                backdrop: 'static',
                keyboard: false,
                resolve: {},
                size: 'sm'
            };

            return $modal.open(modalDO).result;
        }

        function modalBadToken(){
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

    modalResetCtrl.$inject = ['$modalInstance'];

    function modalResetCtrl($modalInstance) {
        var vm = this;
        vm.close = function() {
            $modalInstance.dismiss();
        }
    }

    modalBadTokenCtrl.$inject = ['$modalInstance', '$window'];

    function modalBadTokenCtrl($modalInstance, $window){
        var vm = this;
        vm.close = function(){
            $modalInstance.dismiss();
            $window.location = '/auth/';
        }
    }

})(window, window.angular);
