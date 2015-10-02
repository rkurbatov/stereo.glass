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
                vm.viewMode = '2D';
                vm.imgSrc = getImgUrl(list[idx]);
                vm.setLoadedState = setLoadedState;
                vm.setErrorState = setErrorState;
                vm.imgLoaded = false;

                vm.close = ()=> $modalInstance.dismiss('cancel');

                vm.switchViewMode = (mode)=> {
                    if (mode === vm.viewMode) return;
                    vm.viewMode = mode;
                    vm.imgSrc = mode === '2D'
                        ? getImgUrl(list[idx])
                        : getImgUrl3D(list[idx]);
                };

                function setLoadedState() {
                    vm.imgLoaded = true;
                }

                function setErrorState() {
                    console.log('setting error');
                    vm.imgLoaded = true;
                    vm.imgSrc = '/img/no-image.png';
                }

                function getImgUrl(layout) {
                    return '/uploads/ready/' + layout.urlDir + '/' + layout.url2d;
                }

                function getImgUrl3D(layout) {
                    return '/uploads/ready/' + layout.urlDir + '/' + layout.urlGifHiRes;
                }
            }
        }

    }

})(window, window.angular);