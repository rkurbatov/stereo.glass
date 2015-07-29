(function(window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('MainPage', MainPage);

    MainPage.$inject = ['$scope', 'auxData'];

    function MainPage($scope, auxData) {

        var vm = this;

        // switch coords for 15:8 / 15:10 ratio
        // TODO: move watcher to directive
        $scope.$watch(function () {
                return vm.isWideScreen;
            },
            function (newVal) {
                if (newVal) {
                    vm.coords = auxData.coordsWideScreen;
                } else {
                    vm.coords = auxData.coordsNarrowScreen;
                }
            });
    }

})(window, window.angular);
