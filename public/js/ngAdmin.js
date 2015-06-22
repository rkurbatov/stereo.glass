var app = angular.module('sgAppAdmin',
    [
        'smart-table',
        'angularUtils.directives.dirPagination',
        'daterangepicker',
        'ui.bootstrap',
        'ngCookies',
        'hmTouchEvents'
    ])
    .constant('_', window._)        // use lodash as $rootScope constant
    .run(function ($rootScope) {
        $rootScope._ = window._;
    })
    .service('sgCategoriesSvc', ['$http', '$q', sgCategoriesSvc])
    .controller('sgUsersCtrl', ['$scope', '$http', '$sce', '$modal', '$cookies', sgUsersCtrl])
    .controller('sgLayoutsCtrl', ['sgCategoriesSvc', sgCategoriesCtrl])
    .controller('sgRatingsCtrl', ['$scope', '$http', '$sce', '$modal', '$cookies', 'sgCategoriesSvc', sgRatingsCtrl])
    .controller('sgLayoutItemCtrl', ['$scope', '$http', sgLayoutItemCtrl])
    .directive('sgOnImgload', ['$parse', sgOnImgload]);
