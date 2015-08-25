(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Languages', Languages);

    Languages.$inject = ['sgIntSvc', 'sgLangModals'];
    function Languages(sgIntSvc, sgLangModals) {

        //===== DECLARATION =====
        var vm = this;

        vm.manage = sgLangModals.manage;
        vm.parseTemplates = parseTemplates;
        vm.changed = changed;

        initController();

        //=== IMPLEMENTATION ====

        function initController() {
            vm.list = sgIntSvc.langs;
        }

        function parseTemplates() {
            sgLangModals.parseTemplates();
        }

        function changed(){
            console.log('selected lang: ', vm.selected);
        }

    }

})(window, window.angular);
