(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Languages', Languages);

    Languages.$inject = ['sgIntSvc', 'sgLangModals'];
    function Languages(sgIntSvc, sgLangModals) {

        //===== DECLARATION =====
        var vm = this;
        vm.langs = sgIntSvc.langs;

        vm.manage = sgLangModals.manage;

        initController();

        //=== IMPLEMENTATION ====

        function initController() {

        }

    }

})(window, window.angular);
