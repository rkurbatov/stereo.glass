var app = angular.module('sgAppAdmin', ['smart-table'])
    .controller('sgUsersCtrl', ['$scope', '$http', sgUsersCtrl])
    .controller('sgRatingsCtrl', ['$scope', '$http', sgRatingsCtrl])
    .controller('sgCatCtrl', ['$scope', '$http', sgCatCtrl]);

function sgUsersCtrl($scope, $http) {
    'use strict';

    $http.get('/api/userlist').then(function (response) {
        $scope.rowCollection = response.data;
    });
}

function sgRatingsCtrl($scope, $http) {
    'use strict';

    $http.get('/api/layoutslist').then(function (response) {
        $scope.rowCollection = response.data;
    });
}


function sgCatCtrl($scope, $http) {
    'use strict';

    $http({
        url: '/api/category',
        method: 'GET',
        params: {catname: 'colors'}
    }).then(function (response) {
        $('#colors-selector').html(catToHtml(response.data)).selectpicker('refresh');
    });

    $http({
        url: '/api/category',
        method: 'GET',
        params: {catname: 'assortment'}
    }).then(function (response) {
        $('#assortment-selector').html(catToHtml(response.data)).selectpicker('refresh');
    });

    $http({
        url: '/api/category',
        method: 'GET',
        params: {catname: 'plots'}
    }).then(function (response) {
        $('#plots-selector').html(catToHtml(response.data)).selectpicker('refresh');
    });

    // fill countries selector and remove has-error class
    $http({
        url: '/api/category',
        method: 'GET',
        params: {catname: 'countries'}
    }).then(function (response) {
        $('#countries-selector')
            .html(catToHtml(response.data))
            .selectpicker('refresh')
            .selectpicker('val', 'international')
            .parent('.form-group.sg-validable').removeClass('has-error');
    });

}

function catToHtml(obj) {
    return obj.map(workOnGroup).join('');

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
                name = nel.name? nel.name : ''; // if name is undefined

            return '<option value="' + nel.value + '"' + subtext + icon + '>' + name + '</option>';

        }).join('') + postS);
    }
}