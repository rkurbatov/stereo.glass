(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgAltSrc', sgAltSrc);

    sgAltSrc.$inject = ['auxData'];

    function sgAltSrc(auxData) {
        var ddo = {
            restrict: 'A',
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {
            var key = attrs.sgAltSrc;
            var source = auxData.bkImgs[key];
            var altSource = auxData.animImgs[key];
            if (source) {
                scope.$watch(
                    function () {
                        return source.loaded
                    },
                    function (newVal) {
                        if (newVal && !elm[0].src) {
                            elm[0].src = source.src;
                        }
                    });
            }
            if (altSource) {
                scope.$watch(
                    function () {
                        return altSource.loaded
                    },
                    function (newVal) {
                        if (newVal) {
                            elm[0].src = altSource.src;
                        }
                    });
            }
        }
    }

})(window, window.angular);