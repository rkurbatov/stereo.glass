(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLayoutModals', sgLayoutModals);

    sgLayoutModals.$inject = ['$modal', '$sce', 'sgUsers', 'sgLayouts', 'sgCategories'];

    function sgLayoutModals($modal, $sce, sgUsers, sgLayouts, sgCategories) {

        // ==== DECLARATION =====
        var svc = this;

        svc.edit = modalEditLayout;
        svc.openCarousel = modalGalleryCarousel;
        svc.remove = modalYesNoImage;
        svc.restore = modalYesNoImage;
        svc.revert = modalYesNoImage;
        svc.assignDoer = modalAssignDismissDoer;
        svc.acceptReject = modalAcceptReject;
        svc.approveDecline = modalApproveDecline;
        svc.uploadFiles = modalUploadFiles;
        svc.downloadFiles = modalDownloadFiles;
        svc.addLayoutComment = modalAddLayoutComment;

        svc.shopVisibility = modalYesNoImage;

        // === IMPLEMENTATION ===

        function modalEditLayout(layout) {
            var modalDO = {
                templateUrl: '/templates/modal/editLayout',
                controller: EditLayoutCtrl,
                controllerAs: 'vm',
                resolve: {
                    layout: function () {
                        return layout;
                    }
                },
                size: 'sm'
            };

            return $modal.open(modalDO).result;
        }

        EditLayoutCtrl.$inject = ['$modalInstance', 'layout'];

        function EditLayoutCtrl($modalInstance, layout) {
            var vm = this;
            vm.layout = layout;
            vm.categories = {};

            sgCategories.loaded.then(function(){
                vm.categories.assortment = sgCategories.assortmentArr;
                vm.categories.colors = sgCategories.colorsArr;
                vm.categories.countries = sgCategories.countriesArr;
                vm.categories.plots = sgCategories.plotsArr;
            });

            vm.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        }

        function modalGalleryCarousel(gallery) {
            var modalDO = {
                templateUrl: '/templates/modal/galleryCarousel',
                controller: GalleryCtrl,
                controllerAs: 'carousel',
                resolve: {
                    gallery: function () {
                        return gallery;
                    }
                },
                size: 'lg'
            };

            return $modal.open(modalDO).result;
        }

        GalleryCtrl.$inject = ['$modalInstance', 'gallery'];

        function GalleryCtrl($modalInstance, gallery) {
            var carousel = this;
            carousel.cancel = cancel;
            carousel.prevImg = prevImg;
            carousel.nextImg = nextImg;
            carousel.keyHandler = keyHandler;
            carousel.setLoadedState = setLoadedState;

            initController();

            function initController() {
                carousel.layouts = gallery.filteredLayouts;
                carousel.idx = gallery.currentLayoutIndex;
                carousel.filters = gallery.filters;
                carousel.viewMode = gallery.viewMode;
                carousel.imgLoaded = false;
                carousel.url = getLayoutUrl();
            }

            function setLoadedState() {
                carousel.imgLoaded = true;
            }

            // TODO: Rewrite as directive for left-right detection
            function keyHandler(e) {
                if (e.keyCode === 37) carousel.idx -= 1;
                if (e.keyCode === 39) carousel.idx += 1;
            }

            function getLayoutUrl() {
                return gallery.viewMode === 'Ready'
                    ? '/uploads/ready/' + carousel.layouts[carousel.idx].urlDir + '/' + carousel.layouts[carousel.idx].urlGifHiRes
                    : sgLayouts.getImgUrl(carousel.layouts[carousel.idx]);

            }

            // TODO: Mark image as viewed
            function prevImg() {
                if (carousel.idx > 0) {
                    // set as viewed if no rating was selected
                    if (carousel.layouts[carousel.idx].rating === -1) {
                        carousel.layouts[carousel.idx].rating = 0;
                    }
                    carousel.idx -= 1;
                }
                carousel.imgLoaded = false;
                carousel.url = getLayoutUrl();
            }

            function nextImg() {

                if (carousel.idx < (carousel.layouts.length - 1)) {
                    // set as viewed if no rating was selected
                    if (carousel.layouts[carousel.idx].rating === -1) {
                        carousel.layouts[carousel.idx].rating = 0;
                    }
                    carousel.idx += 1;
                }
                carousel.imgLoaded = false;
                carousel.url = getLayoutUrl();
            }

            function cancel() {
                // set as viewed if no rating was selected
                if (carousel.layouts[carousel.idx].rating === -1) {
                    carousel.layouts[carousel.idx].rating = 0;
                }
                $modalInstance.dismiss('cancel');
            }
        }

        // Dialog with yes-no options, image and possible comment
        function modalYesNoImage(layout, header, message, hasComment) {
            var modalDO = {
                templateUrl: '/templates/modal/YesNoImage',
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
            vm.hasComment = hasComment;

            vm.ok = function () {
                var response = hasComment
                    ? { comment: vm.comment}
                    : 'ok';
                $modalInstance.close(response);
            };

            vm.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }

        function modalAssignDismissDoer(layout) {
            var modalDO = {
                templateUrl: '/templates/modal/assignDismissDoer',
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
                templateUrl: '/templates/modal/acceptRejectLayout',
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
                templateUrl: '/templates/modal/approveDeclineLayout.jade',
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
                templateUrl: '/templates/modal/uploadFiles',
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
                templateUrl: '/templates/modal/downloadFiles',
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
                templateUrl: '/templates/modal/addLayoutComment',
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