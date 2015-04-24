sgAdminApp.config(appRoutes);

function appRoutes($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('index', {
			url: '/admin',
			template: '<h1>admin</h1>',
			data: {
			}
		})
}

/*angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', appRoutes]);

function appRoutes($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/admin', {
            templateUrl: 'partials/admin-main',
            controller: 'MainController'
        })

        // nerds page that will use the NerdController
        .when('/admin/login', {
            templateUrl: 'partials/login',
            controller: 'LoginController'
        });

    $locationProvider.html5Mode(true);

}*/