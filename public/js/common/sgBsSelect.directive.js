// directive to data communication with bootstrap selectors
(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgBsSelect', sgBsSelect);

    sgBsSelect.$inject = [];

    function sgBsSelect() {
        var ddo = {
            restrict: 'A',
            scope: {
                data: '=sgBsSelect',
                execOnChange: '&'
            },
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {
            // fill selector
            scope.$watch(
                function () {
                    if (scope.data) return scope.data.content;
                },
                function (newV) {
                    if (newV) {
                        elm.html(scope.data.content).selectpicker('refresh');
                    }
                }
            );

            scope.$watch(
                function () {
                    if (scope.data) return scope.data.selection;
                },
                function (newV) {
                    if (angular.isArray(newV) && !newV.length) {
                        elm.selectpicker('deselectAll');
                    }
                }
            );

            // get selection on change
            elm.on('change', function (evt) {
                scope.data.selection = elm.val() || [];
                scope.$apply(function () {
                    scope.execOnChange();
                });
            });
        }
    }

})();