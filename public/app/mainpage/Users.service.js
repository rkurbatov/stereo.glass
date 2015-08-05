(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .service('Users', Users);

    Users.$inject = ['$cookies', '$modal', '$http', '$window', '$timeout'];

    function Users($cookies, $modal, $http, $window, $timeout) {

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

            vm.formError = false;
            vm.cancel = cancel;
            vm.signIn = signIn;
            vm.signInMail = '';
            vm.signInPassword = '';

            function signIn() {
                console.log('trying to sign-in');

                $http.post('/auth/login', {
                        usermail: vm.signInMail,
                        password: vm.signInPassword
                    }
                )
                    .then(function () {
                        console.log('signed in');
                        $window.location = '/admin';
                    })
                    .catch(function () {
                        shakeForm();
                    });
            }

            function cancel() {
                $modalInstance.dismiss();
            }

            function shakeForm() {
                vm.formError = true;
                $timeout(function(){
                    vm.formError = false;
                }, 300)
            }
        }

    }

})(window, window.angular);