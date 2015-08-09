(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .service('Users', Users);

    Users.$inject = ['$cookies', '$modal', '$http', '$q', '$window', '$timeout'];

    function Users($cookies, $modal, $http, $q, $window, $timeout) {

        // ==== DECLARATION ====
        var svc = this;
        svc.currentUser = {};
        svc.allRoles = ['admin', 'curator', 'founder', 'designer', 'user', 'visitor'];

        svc.modalSignInRegister = modalSignInRegister;

        init();

        // ==== IMPLEMENTATION ====

        function init() {
            updateCurrentUser();
        }

        function updateCurrentUser() {
            svc.currentUser.name = $cookies.get('username');
            svc.currentUser.mail = $cookies.get('usermail');
            svc.currentUser.userrole = $cookies.get('userrole');
        }

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

            vm.register = register;
            vm.registerName = '';
            vm.registerMail = '';
            vm.registerPassword = '';
            vm.registerConfirm = '';

            vm.forgot = forgot;
            vm.forgotName = '';
            vm.forgotMail = '';

            vm.validateAsyncUsername = validateAsyncUsername;
            vm.getRegisterUsernameError = getRegisterUsernameError;
            vm.validateAsyncUsermail = validateAsyncUsermail;
            vm.getRegisterUsermailError = getRegisterUsermailError;


            function signIn() {
                vm.loginPromise = $http.post('/auth/login', {
                        usermail: vm.signInMail,
                        password: vm.signInPassword
                    }
                );

                vm.loginPromise.then(function () {
                    updateCurrentUser();
                    cancel();
                    if (_.contains(['admin', 'curator', 'designer'], svc.currentUser.userrole)) {
                        $window.location = '/admin';
                    }
                }).catch(function () {
                    shakeForm();
                });
            }

            function register() {
                vm.registerPromise = $http.post('/auth/register', {
                    username: vm.registerName,
                    usermail: vm.registerMail,
                    password: vm.registerPassword
                });

                vm.registerPromise.then(function () {
                    updateCurrentUser();
                    cancel();
                    if (_.contains(['admin', 'curator', 'designer'], svc.currentUser.userrole)) {
                        $window.location = '/admin';
                    }
                });
            }

            function forgot() {
                var forgotObject = {};
                if (vm.forgotMail) {
                    forgotObject.forgotMail = vm.forgotMail;
                }
                if (vm.forgotName) {
                    forgotObject.forgotName = vm.forgotName;
                }
                console.log('forgot');
                vm.forgotPromise = $http
                    .post('/auth/forgot', forgotObject)
                    .then(function (response) {
                        var token = response.data.token;
                        var mailBox = response.data.mail;

                        var mail = {
                            template: 'passwordRecovery',
                            subject: 'Password recovery',
                            to: mailBox
                        };
                        var vars = {
                            token: token
                        };
                        return $http.post('/api/mail/', {
                            params: {
                                mail: mail,
                                vars: vars
                            }
                        });
                    });

            }

            function validateAsyncUsername(username) {
                return $http.post('/auth/check-username', {username: username})
                    .then(function (result) {
                        return result.status === 204 || $q.reject();
                    });
            }

            function validateAsyncUsermail(usermail) {
                return $http.post('/auth/check-usermail', {usermail: usermail})
                    .then(function (result) {
                        return result.status === 204 || $q.reject();
                    });
            }

            function getRegisterUsernameError(error) {
                if (error.minlength) {
                    return 'Имя слишком короткое!';
                } else if (error.validatorAsync) {
                    return 'Это имя уже занято!';
                }
            }

            function getRegisterUsermailError(error) {
                if (error.validatorAsync) {
                    return 'Этот почтовый ящик используется!';
                }
            }

            function cancel() {
                $modalInstance.dismiss();
            }

            function shakeForm() {
                vm.formError = true;
                $timeout(function () {
                    vm.formError = false;
                }, 300)
            }
        }

    }

})(window, window.angular);