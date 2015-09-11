(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgMiniature', sgMiniature);

    sgMiniature.$inject = ['$modal'];

    function sgMiniature($modal) {

        return {
            restrict: 'ACE',
            templateUrl: '/templates/directive/sgMiniature',
            require: '?^sgMiniatureGallery',
            scope: {},
            link
        };

        function link(scope, elm, attrs, ctrl) {
            scope.src = attrs.src || '';
            scope.miniSrc = attrs.miniSrc || scope.src || '';

            if (scope.src) {
                scope.expand = expand;
                if (ctrl && ctrl.imgSrcArray) {
                    ctrl.imgSrcArray.push(scope.src);
                }
            } else {
                console.error('Error: there is no image source!')
            }

            function expand() {
                var modalDO = {
                    templateUrl: '/templates/modal/expandImg',
                    controller: ExpandImgCtrl,
                    controllerAs: 'vm',
                    resolve: {
                        gallery: ()=> {
                            return ctrl;
                        }
                    },
                    size: 'lg'
                };

                $modal.open(modalDO);

                ExpandImgCtrl.$inject = ['$modalInstance', 'gallery'];

                function ExpandImgCtrl($modalInstance, gallery) {
                    var vm = this;
                    vm.imgLoaded = false;
                    vm.close = $modalInstance.close;
                    vm.imgSrc = scope.src;

                    vm.nextImg = nextImg;
                    vm.prevImg = prevImg;
                    vm.setLoadedState = setLoadedState;

                    initController();

                    //==== IMPLEMENTATION ====

                    function initController() {
                        if (gallery && gallery.imgSrcArray
                            && gallery.imgSrcArray.length
                            && gallery.imgSrcArray.length > 1) {
                            vm.galleryMode = true;
                            gallery.curIdx = gallery.imgSrcArray.indexOf(vm.imgSrc);
                        }
                    }

                    function nextImg() {
                        if (vm.galleryMode) {
                            if (gallery.curIdx === gallery.imgSrcArray.length - 1) {
                                gallery.curIdx = 0;
                            } else {
                                gallery.curIdx += 1;
                            }
                            vm.imgLoaded = false;
                            vm.imgSrc = gallery.imgSrcArray[gallery.curIdx];
                        }
                    }

                    function prevImg() {
                        if (vm.galleryMode) {
                            if (gallery.curIdx === 0) {
                                gallery.curIdx = gallery.imgSrcArray.length - 1;
                            } else {
                                gallery.curIdx -= 1;
                            }
                            vm.imgLoaded = false;
                            vm.imgSrc = gallery.imgSrcArray[gallery.curIdx];
                        }
                    }

                    function setLoadedState() {
                        vm.imgLoaded = true;
                    }
                }

            }
        }

    }

})(window, window.angular);