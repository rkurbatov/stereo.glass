(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLayoutControls', sgLayoutControls);

    sgLayoutControls.$inject = ['$modal'];

    function sgLayoutControls($modal) {

        // ==== DECLARATION =====
        var svc = this;

        svc.modalRemove = modalRemove;

        // === IMPLEMENTATION ===

        function modalRemove(layout) {
            var modalDO = {
                templateUrl: '/partials/modal-YesNoImage',
                controller: ['$modalInstance', 'url', YesNoModalCtrl],
                controllerAs: 'vm',
                resolve: {
                    url: function () {
                        return '/uploads/' + layout.urlDir + '/' + layout.urlThumb
                    }
                },
                size: 'sm'
            };

            return $modal.open(modalDO).result;
        }

        function YesNoModalCtrl($modalInstance, url) {
            var vm = this;
            vm.url = url;

            vm.ok = function () {
                $modalInstance.close('ok');
            };

            vm.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }

    }
})();