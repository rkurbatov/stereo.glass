(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('sgRatingsCtrl', sgRatingsCtrl);

    sgRatingsCtrl.$inject = ['$scope', '$sce', '$modal', 'sgCategories', 'sgLayouts', 'sgUsers'];

    function sgRatingsCtrl($scope, $sce, $modal, sgCategories, sgLayouts, sgUsers) {




        // Range date init

        $scope.dateRange = {};

        $scope.dpopts = {
            todayHighlight: true,
            format: 'DD.MM.YY',
            startDate: moment().subtract(1, 'month'),
            endDate: moment(),
            maxDate: moment(),
            language: 'ru',
            locale: {
                applyClass: 'btn-green',
                applyLabel: "Применить",
                fromLabel: "С",
                toLabel: "по",
                cancelLabel: 'Отмена',
                customRangeLabel: 'Другой интервал'
            },
            ranges: {
                'Всё время': ['01.01.15', moment()],
                'Сегодня': [moment(), moment()],
                'Вчера и сегодня': [moment().subtract(1, 'days'), moment()],
                'Неделя': [moment().subtract(6, 'days'), moment()],
                'Месяц': [moment().subtract(1, 'month'), moment()]
            }
        };

        $scope.resetDR = function () {
            $('#rate-daterange').data('daterangepicker').setStartDate('01.01.15');
            $('#rate-daterange').data('daterangepicker').setEndDate(moment());

            $scope.dateRange = $scope.dateRange || {};
            $scope.dateRange.startDate = moment('2015-01-01');
            $scope.dateRange.endDate = moment();
        };

        // Selectors init
        sgCategories.loaded.then(function () {
            $scope.assortmentHash = sgCategories.assortmentHash;
            $scope.countriesHash = sgCategories.countriesHash;
            $scope.plotsHash = sgCategories.plotsHash;
        });




        $scope.getColors = function () {
            if ($scope.pager.selectedIndex === -1) return '';

            return $sce.trustAsHtml($scope.filteredLayouts[$scope.pager.selectedIndex].catColors.map(function (v) {
                switch (v) {
                    case 'black':
                        return "<span class='fa fa-photo sg-" + v + "-i'></span>";
                    case 'multicolor':
                        return "<span class='fa fa-photo sg-" + v + "'></span>";
                    default:
                        return "<span class='glyphicon glyphicon-stop sg-" + v + "-i'></span>";
                }
            }).join(''));
        };

        $scope.getValues = function (cat, hash) {
            if ($scope.pager.selectedIndex === -1) return '';

            return $scope.filteredLayouts[$scope.pager.selectedIndex][cat].map(function (el) {
                return $scope[hash][el];
            }).join(', ');
        };

        $scope.show2dModal = function () {
            if ($scope.pager.selectedIndex === -1 || $scope.filteredLayouts[$scope.pager.selectedIndex].url2d === '') return undefined;

            var modalScope = $scope.$new(true);
            modalScope.getRatingClassName = $scope.getRatingClassName;
            modalScope.getAssignedRating = $scope.getAssignedRating;
            modalScope.setViewed = $scope.setViewed;
            modalScope.removeMyRating = $scope.removeMyRating;
            modalScope.idx = $scope.pager.selectedIndex;
            modalScope.layoutFilter = $scope.pager.layoutFilter;
            modalScope.lts = $scope.filteredLayouts;

            $scope.modalImg = $modal.open({
                templateUrl: '/partials/modalimg',
                controller: modalPopUpCtrl,
                scope: modalScope,
                size: 'lg'
            });

        };

        $scope.confirmRemove = function (layout) {
            var modalScope = $scope.$new(true);
            var layoutId = layout['_id'];

            modalScope.url = '/uploads/' + layout.urlDir + '/' + layout.urlThumb;

            var modalInstance = $modal.open({
                templateUrl: '/partials/modalYesNoImage',
                controller: sgYesNoModalCtrl,
                scope: modalScope,
                size: 'sm'
            });

            modalInstance.result.then(function () {
                sgLayouts.removeLayout(layoutId).then(function () {
                    // check if removing last added image
                    if ($scope.pager.selectedIndex === $scope.layouts.length - 1) {
                        $scope.pager.selectedIndex -= 1;
                    }
                    $scope.loadData();
                });
            });
        };

        function getSelectedIndex() {
            return $scope.pager.selectedIndex - ($scope.pager.currentPage - 1) * $scope.pager.ipp;
        }

        function setSelectedIndex(index) {
            $scope.pager.selectedIndex = ($scope.pager.currentPage - 1) * $scope.pager.ipp + index;
        }

        $scope.$watch('dateRange', $scope.loadData, true);



        $scope.getAssignedRating = function (layout) {
            if ($scope.pager.layoutFilter.mode === 'view') {
                return _.find(layout.ratings, {'assignedBy': $scope.pager.layoutFilter.user}).value;
            } else {
                return '';
            }
        };

        $scope.openEditLayoutDialog = function(layout) {
            var modalScope = $scope.$new(true);
            var layoutId = layout['_id'];

            modalScope.layout = layout;

            var modalInstance = $modal.open({
                templateUrl: '/partials/modalEditLayout',
                controller: sgYesNoModalCtrl,
                scope: modalScope,
                size: 'lg'
            });

            modalInstance.result.then(function () {

            });

        };

        $scope.assignDoerDialog = function(layout) {
            var modalScope = $scope.$new(true);
            var layoutId = layout['_id'];

            modalScope.layout = layout;

        }

    }

})();


// jQuery - Angular selector link
$(function () {
    // TODO: Fix date filter
    var $scope = angular.element($('#sgRatingsCtrl')).scope();

    $(window).load(function () {
        if ($scope) {
            $scope.$apply(function () {
                //$scope.resetDR();
            })
        }
    });

});
