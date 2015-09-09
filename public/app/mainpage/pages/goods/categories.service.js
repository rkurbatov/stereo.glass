(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .service('categoriesSvc', categoriesSvc);

    categoriesSvc.$inject = ['$http', '$q'];

    function categoriesSvc($http, $q) {

        var svc = this;
        svc.load = load;

        // IMPLEMENTATION

        function load(){
            return $q.all([
                $http.get('/api/categories/assortment'),
                $http.get('/api/categories/colors'),
                $http.get('/api/categories/countries'),
                $http.get('/api/categories/plots')
            ]).then(function (responseArray) {
                return {
                    assortment: catToArray(responseArray[0].data),
                    colors: catToArray(responseArray[1].data),
                    countries: catToArray(responseArray[2].data),
                    plots: catToArray(responseArray[3].data)
                }
            });
        }

        function catToArray(src) {
            var dst = [];

            if (src.length === 1) {
                return leavesToOptions(src[0].leaves);
            }
            else if (src.length > 1) {
                _.forEach(src, function (subCategory) {
                    dst.push({
                        label: subCategory.subCatName,
                        options: leavesToOptions(subCategory.leaves)
                    });
                });
            }

            return dst;
        }

        function leavesToOptions(leaves) {
            var dst = [];

            _.forEach(leaves, function (elm) {
                var tmpObject = {};
                if (elm.icon) {
                    tmpObject.icon = elm.icon;
                }
                if (elm.subtext) {
                    tmpObject.subtext = elm.subtext;
                }
                if (elm.value) {
                    tmpObject.value = elm.value;
                }
                if (elm.name) {
                    tmpObject.text = elm.name;
                }
                dst.push(tmpObject);
            });

            return dst;
        }
    }

})(window, window.angular);

