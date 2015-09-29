(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgModals', sgModals);

    sgModals.$inject = ['$modal', '$sce'];

    function sgModals($modal, $sce) {

        var svc = this;

        svc.YesNo = modalYesNo;

        function modalYesNo(header, message) {
            var modalDO = {
                templateUrl: '/templates/modal/YesNo',
                controller: YesNoCtrl,
                controllerAs: 'vm',
                resolve: {
                    header: ()=> header,
                    message: ()=> $sce.trustAsHtml(message)
                },
                size: 'sm'
            };

            return $modal.open(modalDO).result;
        }

        YesNoCtrl.$inject = ['$modalInstance', 'header', 'message'];

        function YesNoCtrl($modalInstance, header, message) {
            var vm = this;
            vm.header = header;
            vm.message = message;

            vm.ok = ()=> $modalInstance.close('ok');
            vm.cancel = ()=> $modalInstance.dismiss('cancel');
        }
    }

})();