(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLayoutModals', sgLayoutModals);

    sgLayoutModals.$inject = ['$modal', '$sce', 'sgUsers', 'sgLayouts'];

    function sgLayoutModals($modal, $sce, sgUsers, sgLayouts) {

        // ==== DECLARATION =====
        var svc = this;

        svc.showInGallery = modalShowInGallery;
        svc.remove = modalYesNoImage;
        svc.restore = modalYesNoImage;
        svc.assignDoer = modalAssignDismissDoer;
        svc.acceptReject = modalAcceptReject;
        svc.approveDecline = modalApproveDecline;
        svc.uploadFiles = modalUploadFiles;
        svc.downloadFiles = modalDownloadFiles;
        svc.addLayoutComment = modalAddLayoutComment;

        // === IMPLEMENTATION ===

        function modalShowInGallery(pgScope) {
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

        function modalYesNoImage(layout, header, message, hasComment) {
            var modalDO = {
                templateUrl: '/partials/modal-YesNoImage',
                controller: YesNoImageModalCtrl,
                controllerAs: 'vm',
                resolve: {
                    url: function () {
                        return sgLayouts.getThumbUrl(layout);
                    },
                    header: function () {
                        return $sce.trustAsHtml(header);
                    },
                    message: function () {
                        return $sce.trustAsHtml(message);
                    },
                    hasComment: function () {
                        return hasComment;
                    }
                },
                size: 'sm'
            };

            return $modal.open(modalDO).result;
        }

        YesNoImageModalCtrl.$inject = ['$modalInstance', 'url', 'header', 'message', 'hasComment'];

        function YesNoImageModalCtrl($modalInstance, url, header, message, hasComment) {
            var vm = this;
            vm.url = url;
            vm.header = header;
            vm.message = message;

            vm.ok = function () {
                $modalInstance.close('ok');
            };

            vm.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }

        function modalAssignDismissDoer(layout) {
            var modalDO = {
                templateUrl: '/partials/modal-assignDismissDoer',
                controller: AssignDismissDoerModalCtrl,
                controllerAs: 'vm',
                resolve: {
                    layout: function () {
                        return layout
                    },
                    assignees: function () {
                        return sgUsers.assignees;
                    }
                },
                size: 'lg'
            };

            return $modal.open(modalDO).result;
        }

        AssignDismissDoerModalCtrl.$inject = ['$modalInstance', 'layout', 'assignees'];

        function AssignDismissDoerModalCtrl($modalInstance, layout, assignees) {
            var vm = this;
            vm.layout = layout;

            // viewmode flags
            vm.newAssign = !vm.layout.status;
            vm.reAssign = vm.layout.status === 'assigned' || vm.layout.status === 'accepted';

            vm.url = sgLayouts.getThumbUrl(layout);
            vm.comment = '';

            // Mail is not sent by default!
            vm.sendEmail = false;

            // Current assignee excluded from list in case of reassign
            vm.designers = vm.reAssign
                ? _.without(assignees, vm.layout.assignedTo)
                : assignees;

            // Author is selected by default
            if (_.contains(vm.designers, layout.createdBy)) {
                vm.assignee = layout.createdBy;
            }

            vm.assign = function () {
                var response = {
                    assignedTo: vm.assignee,
                    comment: vm.comment,
                    sendEmail: vm.sendEmail
                };

                $modalInstance.close(response);
            };

            vm.dismiss = function () {
                var response = {
                    dismissed: true,
                    comment: vm.comment,
                    sendEmail: vm.sendEmail
                };

                $modalInstance.close(response);
            };

            vm.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }

        function modalAcceptReject(layout) {
            var modalDO = {
                templateUrl: '/partials/modal-acceptRejectLayout',
                controller: modalAcceptRejectCtrl,
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

        modalAcceptRejectCtrl.$inject = ['$modalInstance', 'layout'];

        function modalAcceptRejectCtrl($modalInstance, layout) {
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

        function modalApproveDecline(layout) {
            var modalDO = {
                templateUrl: '/partials/modal-approveDeclineLayout.jade',
                controller: modalApproveDeclineCtrl,
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

        modalApproveDeclineCtrl.$inject = ['$modalInstance', 'layout'];

        function modalApproveDeclineCtrl($modalInstance, layout) {
            var vm = this;

            vm.approve = approve;
            vm.decline = decline;
            vm.cancel = cancel;

            vm.comment = "";
            vm.url = sgLayouts.getThumbUrl(layout);

            function approve() {
                var response = {
                    comment: vm.comment
                };

                $modalInstance.close(response);
            }

            function decline() {
                var reason = {
                    declined: true,
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
                    && vm.layout.urlGifLoRes;
                //&& vm.layout.urlPsdLayout
                //&& vm.layout.urlTxtProject;
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