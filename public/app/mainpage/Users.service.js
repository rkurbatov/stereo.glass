(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .service('Users', Users);

    Users.$inject = ['$cookies', '$modal'];

    function Users($cookies, $modal) {

        // ==== DECLARATION ====
        var svc = this;
        svc.currentUser = {
            name: $cookies.get('username'),
            mail: $cookies.get('usermail'),
            role: $cookies.get('userrole')
        };
        svc.allRoles = ['admin', 'curator', 'founder', 'designer', 'user', 'visitor'];

        svc.modalSignInRegister = modalSignInRegister;

        // ==== IMPLEMENTATION ====

        function modalSignInRegister() {
            var modalDO = {
                templateUrl: '/partials/modal-signInRegister',
                controller: signInRegisterCtrl,
                controllerAs: 'vm',
                resolve: {},
                size: 'sm'
            };

            return $modal.open(modalDO).result;
        }

        signInRegisterCtrl.$inject = ['$modalInstance']

        function signInRegisterCtrl($modalInstance) {
            var vm = this;

            this.cancel = cancel;

            function cancel() {
                $modalInstance.dismiss();
            }
        }

    }

})(window, window.angular);