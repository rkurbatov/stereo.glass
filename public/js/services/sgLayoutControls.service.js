(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLayoutControls', sgLayoutControls);

    sgLayoutControls.$inject = ['$modal', 'sgUsers'];

    function sgLayoutControls($modal, sgUsers) {

        // ==== DECLARATION =====
        var svc = this;

        svc.modalGallery = modalGallery;
        svc.modalRemove = modalRemove;
        svc.modalAssignDoer = modalAssignDoer;
        svc.modalAccept = modalAccept;

        // === IMPLEMENTATION ===

        function modalGallery(pgScope) {
            var modalDO = {
                templateUrl: '/partials/modal-Gallery',
                controller: GalleryCtrl,
                controllerAs: 'vm',
                resolve: {
                    pgScope: function () {
                        return pgScope;
                    }
                },
                size: 'lg'
            };

            return $modal.open(modalDO).result;
        }

        GalleryCtrl.$inject = ['$modalInstance', 'pgScope'];

        function GalleryCtrl($modalInstance, pgScope) {
            var vm = this;
            vm.cancel = cancel;
            vm.getLayoutUrl = getLayoutUrl;
            vm.prevImg = prevImg;
            vm.nextImg = nextImg;
            vm.keyHandler = keyHandler;
            vm.imgIsLoaded = imgIsLoaded;

            initController();

            function initController() {
                vm.layouts = pgScope.filteredLayouts;
                vm.idx = pgScope.currentLayoutIndex;
                vm.filters = pgScope.filters;
                vm.imgIsLoading = true;
            }


            function imgIsLoaded() {
                console.log('loaded');
                vm.imgIsLoading = false;
            }

            // TODO: Rewrite as directive for left-right detection
            function keyHandler(e) {
                if (e.keyCode === 37) vm.idx -= 1;
                if (e.keyCode === 39) vm.idx += 1;
            }

            function getLayoutUrl() {
                return '/uploads/' + vm.layouts[vm.idx].urlDir + '/' + vm.layouts[vm.idx].url2d;
            }

            // TODO: Mark image as viewed
            function prevImg() {
                if (vm.idx > 0) {
                    vm.idx -= 1;
                }
                vm.imgIsLoading = true;
            }

            function nextImg() {
                if (vm.idx < (vm.layouts.length - 1)){
                    vm.idx += 1;
                }
                vm.imgIsLoading = true;
            }

            function cancel() {
                $modalInstance.dismiss('cancel');
            }
        }

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