var app = angular.module('sgAppAdmin',
    [
        'smart-table',
        'angularUtils.directives.dirPagination',
        'daterangepicker',
        'ui.bootstrap',
        'ngCookies'
    ])
    .controller('sgUsersCtrl', ['$scope', '$http', '$sce', '$modal', '$cookies', sgUsersCtrl])
    .controller('sgCategoriesCtrl', ['$scope', '$http', sgCategoriesCtrl])
    .controller('sgRatingsCtrl', ['$scope', '$http', '$sce', '$modal', sgRatingsCtrl])
    .directive('sgOnImgload', ['$parse', sgOnImgload]);
