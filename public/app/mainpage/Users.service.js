(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .service('Users', Users);

    Users.$inject = ['$cookies'];

    function Users($cookies) {

        // ==== DECLARATION ====
        var svc = this;
        svc.currentUser = {
            name: $cookies.get('username'),
            mail: $cookies.get('usermail'),
            role: $cookies.get('userrole')
        };
        svc.allRoles = ['admin', 'curator', 'founder', 'designer', 'user', 'visitor'];

        svc.signIn = signIn;
        svc.signOut = signOut;

        // ==== IMPLEMENTATION ====

        function signIn(){

        }

        function signOut(){

        }

    }

})(window, window.angular);