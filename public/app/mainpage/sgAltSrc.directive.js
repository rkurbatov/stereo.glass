(function () {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgAltSrc', sgAltSrc);

    sgAltSrc.$inject = [];

    function sgAltSrc() {
        var ddo = {
            restrict: 'A',
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {
            var key = attrs.sgAltSrc;
            var source = scope.$parent.layouter.bkImgs[key];
            var altSource = scope.$parent.layouter.animImgs[key];
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

})();




