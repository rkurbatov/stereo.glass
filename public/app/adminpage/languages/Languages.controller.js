(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Languages', Languages);

    Languages.$inject = ['sgINTSvc', 'sgLangModals'];
    function Languages(sgINTSvc, sgLangModals) {

        //===== DECLARATION =====
        var vm = this;
        vm.langs = sgINTSvc.langs;

        vm.manage = sgLangModals.manage;

        initController();

        //=== IMPLEMENTATION ====

        function initController() {

        }

    }

})(window, window.angular);
