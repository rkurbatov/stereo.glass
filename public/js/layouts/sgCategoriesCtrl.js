function sgCategoriesCtrl($scope, $http) {
    'use strict';

    $http({
        url: '/api/categories',
        method: 'GET',
        params: {catname: 'colors'}
    }).then(function (response) {
        var tmpData = catToHtml(response.data);
        $('#colors-selector').html(tmpData).selectpicker('refresh');
        $('#rate-colors-selector').html(tmpData).selectpicker('refresh');
    });

    $http({
        url: '/api/categories',
        method: 'GET',
        params: {catname: 'assortment'}
    }).then(function (response) {
        var tmpData = catToHtml(response.data);
        $('#assortment-selector').html(tmpData).selectpicker('refresh');
        $('#rate-assortment-selector').html(tmpData).selectpicker('refresh');
    });

    $http({
        url: '/api/categories',
        method: 'GET',
        params: {catname: 'plots'}
    }).then(function (response) {
        var tmpData = catToHtml(response.data);
        $('#plots-selector').html(tmpData).selectpicker('refresh');
        $('#rate-plots-selector').html(tmpData).selectpicker('refresh');
    });

    // fill countries selector and remove has-error class
    $http({
        url: '/api/categories',
        method: 'GET',
        params: {catname: 'countries'}
    }).then(function (response) {
        $('#countries-selector')
            .html(catToHtml(response.data))
            .selectpicker('refresh');
        $('#rate-countries-selector').html(catToHtml(response.data)).selectpicker('refresh');

    });

}
