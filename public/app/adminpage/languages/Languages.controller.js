(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Languages', Languages);

    Languages.$inject = ['sgIntSvc', 'sgLangModals'];
    function Languages(sgIntSvc, sgLangModals) {

        //===== DECLARATION =====
        var vm = this;
        vm.list = sgIntSvc.langs;
        vm.selected = '';

        vm.manage = sgLangModals.manage;

        initController();

        //=== IMPLEMENTATION ====

        function initController() {
            //sgIntSvc.reload().then((langs)=>vm.list = langs);
        }

    }

})(window, window.angular);
