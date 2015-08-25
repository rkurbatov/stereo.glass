(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLangModals', sgLangModals);

    sgLangModals.$inject = ['$modal', 'sgIntSvc', 'toastr'];

    function sgLangModals($modal, sgIntSvc, toastr) {

        var svc = this;

        svc.manage = manage;
        svc.parseTemplates = parseTemplates;

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
            vm.parseTemplates = parseTemplates;

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

            // TODO: checks for pristine state, make selected just saved object
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

        function parseTemplates() {
            return sgIntSvc.parse()
                .then(()=> {
                    toastr.success("Языковые файлы обновлены");
                })
                .catch((err)=> {
                    if (err.status === 404) {
                        toastr.error('Добавьте хотя бы один язык');
                    } else {
                        toastr.error("Невозможно обновить языковые файлы");
                    }
                });
        }
    }

})();