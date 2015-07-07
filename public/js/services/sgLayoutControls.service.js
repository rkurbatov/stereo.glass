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
        svc.modalAccept = modalAccept;

        // === IMPLEMENTATION ===

        function modalRemove(layout) {
            var modalDO = {
                templateUrl: '/partials/modal-YesNoImage',
                controller: YesNoModalCtrl,
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

        YesNoModalCtrl.$inject = ['$modalInstance', 'url'];

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
                controller: AssignDoerModalCtrl,
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

        AssignDoerModalCtrl.$inject = ['$modalInstance', 'layout', 'designers'];

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

        function modalAccept(layout) {
            var modalDO = {
                templateUrl: '/partials/modal-acceptLayout',
                controller: modalAcceptCtrl,
                controllerAs: 'vm',
                resolve: {
                    layout: function () {
                        return layout
                    }
                },
                size: 'lg'
            };

            return $modal.open(modalDO).result;
        }

        modalAcceptCtrl.$inject = ['$modalInstance', 'layout'];

        function modalAcceptCtrl($modalInstance, layout) {
            var vm = this;

            vm.accept = accept;
            vm.reject = reject;
            vm.cancel = cancel;

            vm.comment = "";
            vm.url = '/uploads/' + layout.urlDir + '/' + layout.urlThumb;

            function accept() {
                var response = {
                    comment: vm.comment
                };

                $modalInstance.close(response);
            }

            function reject() {
                var reason = {
                    rejected: true,
                    comment: vm.comment
                };

                $modalInstance.close(reason);
            }

            function cancel() {
                $modalInstance.dismiss('cancel');
            }

        }
    }

})();