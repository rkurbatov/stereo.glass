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
                templateUrl: '/partials/modal-Gallery',
                controller: SignInRegisterCtrl,
                controllerAs: 'vm',
                resolve: {},
                size: 'lg'
            };

            return $modal.open(modalDO).result;
        }


    }

})(window, window.angular);