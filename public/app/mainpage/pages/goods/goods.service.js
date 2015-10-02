(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .service('goodsSvc', goodsSvc);

    goodsSvc.$inject = ['$http', '$modal'];

    function goodsSvc($http, $modal) {

        // ===== DECLARATION =====
        var svc = this;

        svc.list = [];
        svc.load = load;
        svc.modalExpand = modalExpand;

        // ==== IMPLEMENTATION ====

        function load(selection) {
            console.log(selection);
            return $http.get('/api/goods', {
                params: {
                    selection: JSON.stringify(selection)
                }
            });
        }

        function modalExpand(goodsList, currentIdx) {
            var modalDO = {
                templateUrl: '/templates/modal/goodExpand',
                controller: ExpandViewCtrl,
                controllerAs: 'vm',
                resolve: {
                    list: () => {
                        return goodsList;
                    },
                    idx: () => {
                        return currentIdx;
                    }
                },
                size: 'lg'
            };

            ExpandViewCtrl.$inject = ['$modalInstance', 'list', 'idx'];

            return $modal.open(modalDO).result;

            function ExpandViewCtrl($modalInstance, list, idx) {
                var vm = this;
                vm.list = list;
                vm.idx = idx;
                vm.viewMode = '2D';
                vm.imgSrc = getImgUrl(list[idx]);
                vm.setLoadedState = setLoadedState;
                vm.setErrorState = setErrorState;
                vm.nextImg = nextImg;
                vm.prevImg = prevImg;
                vm.imgLoaded = false;

                vm.close = ()=> $modalInstance.dismiss('cancel');

                vm.switchViewMode = (mode)=> {
                    if (mode === vm.viewMode) return;
                    vm.viewMode = mode;
                    updateImgSrc();
                };

                function updateImgSrc() {
                    vm.imgLoaded = false;
                    vm.imgSrc = vm.viewMode === '2D'
                        ? getImgUrl(list[vm.idx])
                        : getImgUrl3D(list[vm.idx]);
                }

                function setLoadedState() {
                    vm.imgLoaded = true;
                }

                function setErrorState() {
                    vm.imgLoaded = true;
                    vm.imgSrc = '/img/no-image.png';
                }

                function getImgUrl(layout) {
                    return '/uploads/ready/' + layout.urlDir + '/' + layout.url2d;
                }

                function getImgUrl3D(layout) {
                    return '/uploads/ready/' + layout.urlDir + '/' + layout.urlGifHiRes;
                }

                function nextImg() {
                    if (vm.idx < vm.list.length - 1) {
                        vm.idx += 1;
                    } else {
                        vm.idx = 0;
                    }
                    updateImgSrc();
                }

                function prevImg() {
                    if (vm.idx > 0) {
                        vm.idx -= 1;
                    } else {
                        vm.idx = vm.list.length - 1;
                    }
                    updateImgSrc();
                }
            }
        }

    }

})(window, window.angular);