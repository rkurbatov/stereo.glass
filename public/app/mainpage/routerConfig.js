(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .config(routerConfig)
        .run(locationConfig);

    routerConfig.$inject = ['$routeProvider'];

    function routerConfig($routeProvider, $location, $rootScope, auxData) {

        $routeProvider
            .when('/', {
                templateUrl: '/pages/carousel/index',
                controller: 'CarouselPage',
                controllerAs: 'carousel'
            })
            .when('/about/:section?/:subsection?', {
                templateUrl: (params)=> {
                    // f.e. /contacts => /pages/contacts/index
                    if (!params.section) return '/pages/about/index';
                    // f.e. /about/assortment => /pages/about/assortment
                    if (!params.subsection) return '/pages/about/' + params.section;
                    // f.e. /about/technology/info => /pages/about/technology-info;
                    return '/pages/about/' + params.section + '-' + params.subsection;
                },
                controller: 'AboutPage',
                controllerAs: 'about'
            })
            .when('/goods/:section?/:subsection?', {
                templateUrl: (params)=> {
                    if (!params.section) return '/pages/goods/index';
                    if (!params.subsection) return '/pages/goods/' + params.section;
                    return '/pages/goods/' + params.section + '-' + params.subsection;
                },
                controller: 'GoodsPage',
                controllerAs: 'goods'
            })
            .when('/contacts/:section?/:subsection?', {
                templateUrl: (params)=> {
                    if (!params.section) return '/pages/contacts/index';
                    if (!params.subsection) return '/pages/contacts/' + params.section;
                    return '/pages/contacts/' + params.section + '-' + params.subsection;
                },
                controller: 'ContactsPage',
                controllerAs: 'contacts'
            })
            .when('/dealers/:section?/:subsection?', {
                templateUrl: (params)=> {
                    if (!params.section) return '/pages/dealers/index';
                    if (!params.subsection) return '/pages/dealers/' + params.section;
                    return '/pages/dealers/' + params.section + '-' + params.subsection;
                },
                controller: 'DealersPage',
                controllerAs: 'dealers'
            })
            .otherwise({redirectTo: '/'});

    }

    locationConfig.$inject = ['$rootScope', '$location', 'auxData'];

    function locationConfig($rootScope, $location, auxData) {
        $rootScope.$on('$routeChangeSuccess', (e, current, pre)=> {
            var path = $location.path().split('/');
            auxData.settings.currentPage = path[1] || "carousel";
            auxData.settings.currentSection = path[2] || "";
        });
    }

})(window, window.angular);
