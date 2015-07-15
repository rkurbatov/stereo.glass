(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgLayoutInfo', sgLayoutInfo);

    sgLayoutInfo.$inject = ['sgCategories', '$sce'];

    function sgLayoutInfo(sgCategories, $sce) {
        var ddo = {
            restrict: 'E',
            scope: {
                layout: '='
            },
            link: link,
            templateUrl: '/partials/directives-sgLayoutInfo'
        };

        return ddo;

        function link(scope, elm, attrs) {
            scope.hashes = sgCategories.hashes;

            scope.$watch('layout', function(newLayout){
                if (newLayout) {
                    scope.colorString = $sce.trustAsHtml(newLayout.catColors.map(function (v) {
                        switch (v) {
                            case 'black':
                                return "<span class='fa fa-photo sg-" + v + "-i'></span>";
                            case 'multicolor':
                                return "<span class='fa fa-photo sg-" + v + "'></span>";
                            default:
                                return "<span class='glyphicon glyphicon-stop sg-" + v + "-i'></span>";
                        }
                    })
                    .join(''));

                    if (newLayout.catAssortment) {
                        scope.assortmentString = ' / ' + newLayout.catAssortment.map(function (el) {
                            return scope.hashes.assortment[el];
                        }).join(', ');
                    }

                    if (newLayout.catPlots) {
                        scope.plotsString = ' / ' + newLayout.catPlots.map(function (el) {
                            return scope.hashes.plots[el];
                        }).join(', ');
                    }

                    if (newLayout.catCountries) {
                        scope.countriesString = ' / ' + newLayout.catCountries.map(function (el) {
                            return scope.hashes.countries[el];
                        }).join(', ');
                    }

                }
            });
        }
    }

})(window, window.angular);