(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .service('goodsSvc', goodsSvc);

    goodsSvc.$inject = ['$http'];

    function goodsSvc($http) {

        // ==== DECLARATION ====
        var svc = this;

        svc.list = [];
        svc.load = load;

        function load() {
            return $http.get('/api/goods');
        }

    }

})(window, window.angular);