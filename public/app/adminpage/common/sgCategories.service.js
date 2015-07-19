(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgCategories', sgCategories);

    sgCategories.$inject = ['$http', '$q'];

    function sgCategories($http, $q) {

        var vm = this;
        vm.hashes = {};

        vm.loaded = $q.all([
            $http.get('/api/categories/assortment'),
            $http.get('/api/categories/colors'),
            $http.get('/api/categories/countries'),
            $http.get('/api/categories/plots')
        ]).then(function (responses) {
            vm.assortment = catToHtml(responses[0].data);
            vm.assortmentHash = catToHash(responses[0].data);
            vm.colors = catToHtml(responses[1].data);
            vm.countries = catToHtml(responses[2].data);
            vm.countriesHash = catToHash(responses[2].data);
            vm.plots = catToHtml(responses[3].data);
            vm.plotsHash = catToHash(responses[3].data);
            vm.hashes.assortment = catToHash(responses[0].data);
            vm.hashes.countries = catToHash(responses[2].data);
            vm.hashes.plots = catToHash(responses[3].data);
        });

        function catToHash(arr) {
            var result = {};

            arr.forEach(parseLeaves);

            function parseLeaves(el) {
                if (el.leaves) {
                    el.leaves.forEach(function (item) {
                        result[item.value] = (!el.subCatName || el.subCatName === "") ? item.name : el.subCatName + ' - ' + item.name;
                    });
                }
            }

            return result;
        }

        function catToHtml(arr) {
            return arr.map(workOnGroup).join('');

            function workOnGroup(el) {
                var preS, postS;
                if (el.subCatName !== '') {
                    preS = '<optgroup label="' + el.subCatName + '">';
                    postS = '</optroup>';
                }
                else {
                    preS = '';
                    postS = '';
                }

                return (preS + el.leaves.map(function (nel) {
                    var subtext = nel.subtext ? ' data-subtext="' + nel.subtext + '"' : '',
                        icon = nel.icon ? ' data-icon="' + nel.icon + '"' : '',
                        name = nel.name ? nel.name : ''; // if name is undefined

                    return '<option value="' + nel.value + '"' + subtext + icon + '>' + name + '</option>';

                }).join('') + postS);
            }
        }

    }

})(window, window.angular);

