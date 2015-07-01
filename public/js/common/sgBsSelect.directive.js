// directive to data communication with bootstrap selectors
(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('bsSelect', bsSelect);

    bsSelect.$inject = [];

    function bsSelect() {
        var ddo = {
            restrict: 'A',
            scope: {
                htmlContent: '=',
                selection: '=',
                execOnChange: '&'
            },
            link: link
        };

        return ddo;

        function link(scope, elm, attrs) {
            // fill selector
            scope.$watch(
                function () {
                    return scope.htmlContent;
                },
                function (newV) {
                    if (newV) {
                        elm.html(scope.htmlContent).selectpicker('refresh');
                    }
                }
            );

            // clear if selection is empty
            scope.$watch(
                function () {
                    return scope.selection;
                },
                function (newV) {
                    if (angular.isArray(newV) && !newV.length) {
                        elm.selectpicker('deselectAll');
                    }
                }
            );

            // get selection on change
            elm.on('change', function (evt) {
                scope.$apply(function(){
                    scope.selection = elm.val() || [];
                });
                scope.execOnChange();
            });
        }
    }

})();