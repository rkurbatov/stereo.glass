(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLayoutControls', sgLayoutControls);

    sgLayoutControls.$inject = ['$modal', 'sgUsers', 'sgLayouts'];

    function sgLayoutControls($modal, sgUsers, sgLayouts) {

        // ==== DECLARATION =====
        var svc = this;

        svc.modalGallery = modalGallery;
        svc.modalRemove = modalRemove;
        svc.modalAssignDoer = modalAssignDoer;
        svc.modalAccept = modalAccept;
        svc.modalUploadFiles = modalUploadFiles;
        svc.modalDownloadFiles = modalDownloadFiles;
        svc.modalAddLayoutComment = modalAddLayoutComment;

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
                vm.imgIsLoading = false;
            }

            // TODO: Rewrite as directive for left-right detection
            function keyHandler(e) {
                if (e.keyCode === 37) vm.idx -= 1;
                if (e.keyCode === 39) vm.idx += 1;
            }

            function getLayoutUrl() {
                return pgScope.viewMode === 'Ready'
                    ? '/uploads/ready/' + vm.layouts[vm.idx].urlDir + '/' + vm.layouts[vm.idx].urlGifHiRes
                    : sgLayouts.getImgUrl(vm.layouts[vm.idx]);

            }

            // TODO: Mark image as viewed
            function prevImg() {
                if (vm.idx > 0) {
                    // set as viewed if no rating was selected
                    if (vm.layouts[vm.idx].rating === -1) {
                        vm.layouts[vm.idx].rating = 0;
                    }
                    vm.idx -= 1;
                }
                vm.imgIsLoading = true;
            }

            function nextImg() {

                if (vm.idx < (vm.layouts.length - 1)) {
                    // set as viewed if no rating was selected
                    if (vm.layouts[vm.idx].rating === -1) {
                        vm.layouts[vm.idx].rating = 0;
                    }
                    vm.idx += 1;
                }
                vm.imgIsLoading = true;
            }

            function cancel() {
                // set as viewed if no rating was selected
                if (vm.layouts[vm.idx].rating === -1) {
                    vm.layouts[vm.idx].rating = 0;
                }
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
                        return sgLayouts.getThumbUrl(layout);
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
            vm.url = sgLayouts.getThumbUrl(layout);
            vm.comment = [];
            // Mail is not sent by default!
            vm.sendEmail = false;

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
            vm.url = sgLayouts.getThumbUrl(layout);

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

        function modalUploadFiles(layout) {
            var modalDO = {
                templateUrl: '/partials/modal-uploadFiles',
                controller: modalUploadFilesCtrl,
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

        modalUploadFilesCtrl.$inject = ['$modalInstance', 'layout'];

        function modalUploadFilesCtrl($modalInstance, layout) {
            var vm = this;

            vm.url = sgLayouts.getThumbUrl(layout);

            vm.submit = submit;
            vm.cancel = cancel;
            vm.layout = layout;
            vm.canSubmit = canSubmit;

            function canSubmit() {
                return vm.layout.urlGifHiRes
                    && vm.layout.urlGifLoRes
                    && vm.layout.urlPsdLayout
                    && vm.layout.urlTxtProject;
            }

            function submit() {
                var response = {
                    comment: vm.comment
                };

                $modalInstance.close(response);
            }

            function cancel() {
                $modalInstance.dismiss('cancel');
            }
        }

        function modalDownloadFiles(layout) {
            var modalDO = {
                templateUrl: '/partials/modal-downloadFiles',
                controller: modalDownloadFilesCtrl,
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

        modalDownloadFilesCtrl.$inject = ['$modalInstance', 'layout'];

        function modalDownloadFilesCtrl($modalInstance, layout) {
            var vm = this;

            vm.layout = layout;
            vm.dir = '/uploads/ready/' + vm.layout.urlDir + '/';
            vm.cancel = cancel;

            function cancel() {
                $modalInstance.dismiss('cancel');
            }
        }

        function modalAddLayoutComment(layout) {
            var modalDO = {
                templateUrl: '/partials/modal-addLayoutComment',
                controller: modalAddLayoutCommentCtrl,
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

        modalAddLayoutCommentCtrl.$inject = ['$modalInstance', 'layout'];

        function modalAddLayoutCommentCtrl($modalInstance, layout) {
            var vm = this;

            vm.url = sgLayouts.getThumbUrl(layout);
            vm.close = close;
            vm.save = save;
            vm.commentText = '';

            function save() {
                $modalInstance.close(vm.commentText);
            }

            function close() {
                $modalInstance.dismiss('close');
            }
        }
    }

})(window, window.angular);