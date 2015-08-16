(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .config(routerConfig);

    routerConfig.$inject = ['$routeProvider'];

    function routerConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/pages/index',
                controller: 'IndexPage',
                controllerAs: 'main'
            })
            .when('/about', {
                templateUrl: '/pages/about',
                controller: 'AboutPage',
                controllerAs: 'about'
            })
            .when('/goods', {
                templateUrl: '/pages/goods',
                controller: 'GoodsPage',
                controllerAs: 'goods'
            })
            .when('/dealers', {
                templateUrl: '/pages/dealers',
                controller: 'DealersPage',
                controllerAs: 'dealers'
            })
            .when('/contacts', {
                templateUrl: '/pages/contacts',
                controller: 'ContactsPage',
                controllerAs: 'contacts'
            })
            .otherwise({ redirectTo: '/' });
    }

})(window, window.angular);
