(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('sgLayoutsCtrl', sgLayoutsCtrl);

    sgLayoutsCtrl.$inject = ['sgCategories'];

    function sgLayoutsCtrl(sgCategories) {
        'use strict';

        sgCategories.loaded.then(function () {
            $('#assortment-selector').html(sgCategories.assortment).selectpicker('refresh');
            $('#colors-selector').html(sgCategories.colors).selectpicker('refresh');
            $('#countries-selector').html(sgCategories.countries).selectpicker('refresh');
            $('#plots-selector').html(sgCategories.plots).selectpicker('refresh');
        });

    }

})(window, window.angular);
