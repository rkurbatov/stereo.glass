(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Languages', Languages);

    Languages.$inject = ['sgIntSvc', 'sgLangModals', 'toastr'];
    function Languages(sgIntSvc, sgLangModals, toastr) {

        //===== DECLARATION =====
        var vm = this;

        vm.manage = sgLangModals.manage;
        vm.parseTemplates = parseTemplates;
        vm.changed = changed;
        vm.trFilter = trFilter;
        vm.getTrClass = getTrClass;

        initController();

        //=== IMPLEMENTATION ====

        function initController() {
            vm.list = sgIntSvc.langs;
        }

        function parseTemplates() {
            sgIntSvc
                .parse()
                .then(()=> {
                    toastr.success("Языковые файлы обновлены");
                    vm.selected = ''
                })
                .catch((err)=> {
                    if (err.status === 404) {
                        toastr.error('Добавьте хотя бы один язык');
                    } else {
                        toastr.error("Невозможно обновить языковые файлы");
                    }
                });
        }

        function changed() {
            sgIntSvc
                .getTranslation(vm.selected)
                .then((response)=> {
                    vm.currentTranslation = response.data;
                })
                .catch((err)=> {
                    toastr.error("Невозможно загрузить файл перевода");
                });
        }

        function trFilter(trString) {
            return trString.status !== 'x';
        }

        function getTrClass(trString) {
            if (trString.status === '~') return 'tr-doubt';
            if (!trString.tr && trString.status !== '!') return 'tr-absent';
            if (trString.tr && trString.status !== '!') return 'tr-editing';
            return 'tr-ready';
        }

    }

})(window, window.angular);
