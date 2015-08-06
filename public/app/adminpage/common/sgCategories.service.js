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
        ]).then(function (responseArray) {
            // old realization
            vm.assortment = catToHtml(responseArray[0].data);
            vm.assortmentHash = catToHash(responseArray[0].data);
            vm.colors = catToHtml(responseArray[1].data);
            vm.countries = catToHtml(responseArray[2].data);
            vm.countriesHash = catToHash(responseArray[2].data);
            vm.plots = catToHtml(responseArray[3].data);
            vm.plotsHash = catToHash(responseArray[3].data);
            vm.hashes.assortment = catToHash(responseArray[0].data);
            vm.hashes.countries = catToHash(responseArray[2].data);
            vm.hashes.plots = catToHash(responseArray[3].data);

            //new realization
            vm.assortmentArr = catToArray(responseArray[0].data);
            console.log(vm.assortmentArr);
            vm.colorsArr = catToArray(responseArray[1].data);
            vm.countriesArr = catToArray(responseArray[2].data);
            vm.plotsArr = catToArray(responseArray[3].data);
        });

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

        function catToHash(arr) {
            var result = {};

            arr.forEach(parseLeaves);

            function parseLeaves(el) {
                if (el.leaves) {
                    el.leaves.forEach(function (item) {
                        result[item.value] = (!el.subCatName || el.subCatName === "")
                            ? item.name
                            : el.subCatName + ' - ' + item.name;
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

