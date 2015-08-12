(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Languages', Languages);

    Languages.$inject = ['sgINTSvc', '$http', 'toastr'];
    function Languages(sgINTSvc, $http, toastr) {

        //===== DECLARATION =====
        var vm = this;
        vm.langs = sgINTSvc.langs;
        vm.addLanguage = addLanguage;

        initController();

        //=== IMPLEMENTATION ====

        function initController() {

        }

        function addLanguage() {
            if (vm.code && vm.name) {
                $http
                    .post('/api/lang', {code: vm.code, name: vm.name})
                    .then(() => {
                        sgINTSvc.reload();
                        toastr.success("Язык успешно добавлен.");
                    })
                    .catch((err)=> {
                        err.status === 409
                            ? toastr.warning("Язык уже существует")
                            : toastr.error("Невозможно добавить язык", "Ошибка");
                    });
            }
        }

    }

})(window, window.angular);
