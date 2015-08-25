(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Languages', Languages);

    Languages.$inject = ['sgIntSvc', 'sgLangModals'];
    function Languages(sgIntSvc, sgLangModals) {

        //===== DECLARATION =====
        var vm = this;
        vm.selected = '';

        vm.manage = sgLangModals.manage;
        vm.parseTemplates = parseTemplates;

        initController();

        //=== IMPLEMENTATION ====

        function initController() {
            vm.list = sgIntSvc.langs;
        }

        function parseTemplates() {
            sgLangModals.parseTemplates().then(()=> vm.selected = '');
        }


    }

})(window, window.angular);
