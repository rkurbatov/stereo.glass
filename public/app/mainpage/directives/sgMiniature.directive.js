(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgMiniature', sgMiniature);

    sgMiniature.$inject = ['$modal'];

    function sgMiniature($modal) {

        return {
            restrict: 'E',
            templateUrl: '/templates/directive/sgMiniature',
            link,
            scope: {}
        };

        function link(scope, elm, attrs) {
            scope.src = attrs.src || '';
            scope.miniSrc = attrs.miniSrc || '';
            if (!scope.miniSrc) scope.miniSrc = scope.src;

            scope.expand = expand;

            function expand() {
                var modalDO = {
                    templateUrl: '/templates/modal/expandImg',
                    controller: ExpandImgCtrl,
                    controllerAs: 'vm',
                    size: 'lg'
                };

                $modal.open(modalDO);

                ExpandImgCtrl.$inject = ['$modalInstance'];

                function ExpandImgCtrl($modalInstance) {
                    var vm = this;
                    vm.close = $modalInstance.close;
                    vm.imgSrc = scope.src;
                }

            }
        }


    }

})(window, window.angular);