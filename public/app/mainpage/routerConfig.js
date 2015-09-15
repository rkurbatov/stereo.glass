(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .config(routerConfig)
        .run(locationConfig);

    routerConfig.$inject = ['$routeProvider'];

    function routerConfig($routeProvider) {

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
            .when('/goods', {
                templateUrl: '/pages/goods/index',
                controller: 'GoodsPage',
                controllerAs: 'goods',
                reloadOnSearch: false
            })
            .when('/contacts/:section?/:subsection?', {
                templateUrl: '/pages/contacts',
                controller: 'ContactsPage',
                controllerAs: 'contacts'
            })
            .when('/dealers/:section?/:subsection?', {
                templateUrl: '/pages/dealers',
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
            auxData.settings.currentSubsection = path[3] || "";
        });
    }

})(window, window.angular);
