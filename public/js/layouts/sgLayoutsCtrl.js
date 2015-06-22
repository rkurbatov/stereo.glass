function sgCategoriesCtrl(sgCategoriesSvc) {
    'use strict';

    sgCategoriesSvc.loaded.then(function () {
        $('#assortment-selector').html(sgCategoriesSvc.assortment).selectpicker('refresh');
        $('#rate-assortment-selector').html(sgCategoriesSvc.assortment).selectpicker('refresh');
        $('#colors-selector').html(sgCategoriesSvc.colors).selectpicker('refresh');
        $('#rate-colors-selector').html(sgCategoriesSvc.colors).selectpicker('refresh');
        $('#countries-selector').html(sgCategoriesSvc.countries).selectpicker('refresh');
        $('#rate-countries-selector').html(sgCategoriesSvc.countries).selectpicker('refresh');
        $('#plots-selector').html(sgCategoriesSvc.plots).selectpicker('refresh');
        $('#rate-plots-selector').html(sgCategoriesSvc.plots).selectpicker('refresh');
    });

}
