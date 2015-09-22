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
                vm.imgSrc = getImgUrl(list[idx]);
                vm.setLoadedState = setLoadedState;
                vm.imgLoaded = false;

                vm.close = function () {
                    $modalInstance.dismiss('cancel');
                };

                function setLoadedState() {
                    vm.imgLoaded = true;
                }

                function getImgUrl(layout) {
                    return '/uploads/ready/' + layout.urlDir + '/' + layout.url2d;
                }
            }
        }

    }

})(window, window.angular);