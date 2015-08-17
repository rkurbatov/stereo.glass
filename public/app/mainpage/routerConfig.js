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
                controllerAs: 'index'
            })
            .when('/about-assortment', {
                templateUrl: '/pages/about-assortment',
                controller: 'AboutPage',
                controllerAs: 'about'
            })
            .when('/about-technology', {
                templateUrl: '/pages/about-technology',
                controller: 'AboutPage',
                controllerAs: 'about'
            })
            .when('/about-documents', {
                templateUrl: '/pages/about-documents',
                controller: 'AboutPage',
                controllerAs: 'about'
            })
            .when('/about-video', {
                templateUrl: '/pages/about-video',
                controller: 'AboutPage',
                controllerAs: 'about'
            })
            .when('/about-photo', {
                templateUrl: '/pages/about-photo',
                controller: 'AboutPage',
                controllerAs: 'about'
            })
            .when('/about-faq', {
                templateUrl: '/pages/about-faq',
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
