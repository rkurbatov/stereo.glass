var sgAdminApp = angular.module('sgAdminApp', 
  [
    'ui.router',
    'ngStorage'
  ])
  .service('SessionService', SessionService)
  .config(appRoutes)
  .run(subscribeStateChange);


function appRoutes($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
  .state('admin', {
   url: '/',
   template: '<h1>admin</h1>'
  })
  .state('login', {
   url: '/login',
   templateUrl: '/partials/login',
   data: {
    noLogin: true
  }
})
  .state('list', {
        url: '/list',
        template: '<ul><li ng-repeat="dog in dogs">{{ dog }}</li></ul>',
        controller: function($scope) {
            $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
        },
        data: { noLogin: true}
    });

    // prevent # in urls
    $locationProvider.html5Mode(true);
  }

function subscribeStateChange($rootScope, $state, $stateParams, SessionService) {
  
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.user = null;

    // logging
    $rootScope.$on("$stateChangeError", console.log.bind(console));

    // checking login
    $rootScope.$on("$stateChangeStart", checkLogin);

    function checkLogin(event, toState, toParams, fromState, fromParams) {
      SessionService.checkAccess(event, toState, toParams, fromState, fromParams);
    }
}

function SessionService($injector) {
  "use strict";

  this.checkAccess = function(event, toState, toParams, fromState, fromParams) {
    var $scope = $injector.get('$rootScope'),
    $sessionStorage = $injector.get('$sessionStorage');

    if (toState.data !== undefined) {
      if (toState.data.noLogin !== undefined && toState.data.noLogin) {
            // если нужно, выполняйте здесь какие-то действия 
            // перед входом без авторизации
          }
        } else {
          // вход с авторизацией
          if ($sessionStorage.user) {
            $scope.$root.user = $sessionStorage.user;
          } else {
            // если пользователь не авторизован - отправляем на страницу авторизации
            event.preventDefault();
            $scope.$state.go('login');
          }
        }
      };
    }
