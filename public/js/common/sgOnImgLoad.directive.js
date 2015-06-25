(function () {
    'use strict';

// directive runs function on image load
    angular
        .module('sgAppAdmin')
        .directive('sgOnImgLoad', sgOnImgLoad);

    sgOnImgLoad.$inject = ['$parse'];

    function sgOnImgLoad($parse) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var fn = $parse(attrs.sgOnImgLoad);
                elem.on('load', function (event) {
                    scope.$apply(function () {
                        fn(scope, {$event: event});
                    });
                });
            }
        }
    }

})();

