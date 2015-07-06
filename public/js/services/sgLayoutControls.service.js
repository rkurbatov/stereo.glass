(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLayoutControls', sgLayoutControls);

    sgLayoutControls.$inject = ['$modal', 'sgUsers'];

    function sgLayoutControls($modal, sgUsers) {

        // ==== DECLARATION =====
        var svc = this;

        svc.modalRemove = modalRemove;
        svc.modalAssignDoer = modalAssignDoer;

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

        function modalAssignDoer(layout) {
            var modalDO = {
                templateUrl: '/partials/modal-assignDoer',
                controller: ['$modalInstance', 'layout', 'designers', AssignDoerModalCtrl],
                controllerAs: 'vm',
                resolve: {
                    layout: function () {
                        return layout
                    },
                    designers: function () {
                        return sgUsers.designers;
                    }
                },
                size: 'lg'
            };

            return $modal.open(modalDO).result;
        }

        function AssignDoerModalCtrl($modalInstance, layout, designers) {
            var vm = this;
            vm.layout = layout;
            vm.url = '/uploads/' + layout.urlDir + '/' + layout.urlThumb;
            vm.comment = [];
            vm.sendEmail = true;

            vm.designers = designers;
            if (_.contains(designers, layout.createdBy)) {
                vm.assignedTo = layout.createdBy;
            }

            vm.ok = function () {
                var response = {
                    assignedTo: vm.assignedTo,
                    comment: vm.comment,
                    sendEmail: vm.sendEmail
                };
                $modalInstance.close(response);
            };

            vm.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }

    }

})();