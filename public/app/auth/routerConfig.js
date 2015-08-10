(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAuth')
        .config(routerConfig);

    routerConfig.$inject = ['$routeProvider'];

    function routerConfig($routeProvider) {
        $routeProvider
            .when('/', {
                template: '',
                controller: 'AuthCtrl'
            })
            .when('/reset-password/:id', {
                template: '',
                controller: 'ResetCtrl'
            })
            .otherwise({ redirectTo: '/' });
    }

})(window, window.angular);
