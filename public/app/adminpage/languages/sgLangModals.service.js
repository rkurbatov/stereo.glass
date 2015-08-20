(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLangModals', sgLangModals);

    sgLangModals.$inject = ['$modal', 'sgIntSvc', 'toastr'];

    function sgLangModals($modal, sgIntSvc, toastr) {

        var svc = this;

        svc.manage = manage;

        function manage() {
            var modalDO = {
                templateUrl: '/templates/modal/languageManage',
                controller: manageCtrl,
                controllerAs: 'vm',
                resolve: {},
                size: 'sm'
            };

            return $modal.open(modalDO).result;
        }

        manageCtrl.$inject = ['$modalInstance'];

        function manageCtrl($modalInstance) {
            var vm = this;

            vm.ok = ok;
            vm.addLanguage = addLanguage;
            vm.updateLanguage = updateLanguage;

            initController();

            // ==== IMPLEMENTATION ====

            function initController() {
                sgIntSvc.reload().then((langs)=>vm.langs = langs);
            }

            function ok() {
                $modalInstance.close('ok');
            }

            function addLanguage() {
                sgIntSvc
                    .add(vm.code, vm.name)
                    .then(() => {
                        sgIntSvc.reload();
                        toastr.success("Язык успешно добавлен.");
                    })
                    .catch((err)=> {
                        err.status === 409
                            ? toastr.warning("Язык уже существует")
                            : toastr.error("Невозможно добавить язык", "Ошибка");
                    });
            }

            function updateLanguage() {
                sgIntSvc
                    .update(vm.selected)
                    .then(()=> {
                        sgIntSvc.reload();
                        toastr.success("Настройки языка обновлены");
                    })
                    .catch((err)=> {
                        toastr.error("Невозможно обновить настройки языка", "Ошибка");
                    });
            }
        }
    }

})();