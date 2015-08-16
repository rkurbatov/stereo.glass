(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .config(routerConfig);

    routerConfig.$inject = ['$routeProvider'];

    function routerConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/pages/indexpage',
                controller: 'IndexPage',
                controllerAs: 'main'
            })
            .otherwise({ redirectTo: '/' });
    }

})(window, window.angular);
