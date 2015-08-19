(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLangModals', sgLangModals);

    sgLangModals.$inject = ['$modal', '$http', 'sgINTSvc', 'toastr'];

    function sgLangModals($modal, $http, sgINTSvc, toastr) {

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

            initController();

            function initController(){
                sgINTSvc.reload()
                .then((langs)=>{
                        vm.langs = langs;
                    })
            }

            vm.ok = function () {
                $modalInstance.close('ok');
            };
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

})();