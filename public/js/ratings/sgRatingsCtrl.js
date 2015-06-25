(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('sgRatingsCtrl', sgRatingsCtrl);

    sgRatingsCtrl.$inject = ['$scope', '$sce', '$modal', '$cookies', 'sgCategories', 'sgLayouts', 'sgUsers'];

    function sgRatingsCtrl($scope, $sce, $modal, $cookies, sgCategories, sgLayouts, sgUsers) {

        $scope.serverFilters = {
            assortment: {selection: []},
            colors: {selection: []},
            countries: {selection: []},
            plots: {selection: []},
            designers: {selection: []}
        };

        // form selectors data
        sgCategories.loaded.then(function () {
            $scope.serverFilters.assortment.content = sgCategories.assortment;
            $scope.serverFilters.colors.content = sgCategories.colors;
            $scope.serverFilters.countries.content = sgCategories.countries;
            $scope.serverFilters.plots.content = sgCategories.plots;
        });

        // Fill designers list
        sgUsers.getLayoutAuthors().then(function (authors) {
            $scope.designers = authors;
            $scope.serverFilters.designers.content = arrToOptions($scope.designers);
            //$('#rate-designer-selector').html(arrToOptions($scope.designers)).selectpicker('refresh');
        });

        // Init controller
        $scope.selection = {};
        $scope.designers = [];

        // Paginator init
        $scope.pager = {
            ipps: [12, 18, 24, 36],     // possible images per page values
            currentPage: 1,
            selectedIndex: -1,          // default - unselected
            layoutOrders: [
                {
                    name: "По дате (старых к новым)",
                    value: ['createdAt']
                },
                {
                    name: "По дате (от новых к старым)",
                    value: ['-createdAt']
                },
                {
                    name: "По убыванию рейтинга",
                    value: ['-average']
                },
                {
                    name: "По возрастанию рейтинга",
                    value: ['average']
                },
                {
                    name: "По уменьшению числа оценивших",
                    value: ['-ratings.length']
                },
                {
                    name: "По увеличению числа оценивших",
                    value: ['ratings.length']
                }
            ],
            layoutFilters: [
                {
                    name: "все",
                    mode: 'rate',
                    value: {}
                },
                {
                    name: "еще не просмотренные",
                    mode: 'rate',
                    value: function (v) {
                        return v.rating === -1 || v.notRatedByMe;
                    }
                },
                {
                    name: "только оцененные и просмотренные мной",
                    mode: 'rate',
                    value: function (v) {
                        return v.rating > -1;
                    }
                }
            ]
        };

        $scope.pager.ipp = $scope.pager.ipps[0];              // default IPP
        $scope.pager.layoutOrder = $scope.pager.layoutOrders[0];
        $scope.pager.layoutFilter = $scope.pager.layoutFilters[0];

        $scope.pager.getSelectedIndex = getSelectedIndex;
        $scope.pager.setSelectedIndex = setSelectedIndex;

        $scope.username = $cookies.get('username');

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


        // Fill paginator
        $scope.loadData = function () {

            if ($scope.dateRange.startDate) $scope.selection.fromDate = $scope.dateRange.startDate.toDate();
            if ($scope.dateRange.endDate) $scope.selection.toDate = $scope.dateRange.endDate.toDate();

            sgLayouts.loadData($scope.serverFilters, $scope.username)
                .then(function (data) {
                    $scope.layouts = data;
                });

        };

        // Reset clicked selector

        $scope.reset = function (category) {
            $scope.serverFilters[category].selection = [];
            $scope.loadData();
        };

        // Reset all selectors and daterange
        $scope.resetAll = function () {
            $scope.resetDR();
        };


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

        $scope.confirmRemove = function (idx) {
            var modalScope = $scope.$new(true);
            var layout = $scope.filteredLayouts[$scope.pager.selectedIndex];
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

        // add to filters array filter by founder name
        sgUsers.getRaters()
            .then(function (raters) {
                _.forEach(raters, addFilter);

                function addFilter(userName) {
                    var filterObject = {
                        name: 'оцененные ' + userName,
                        mode: 'view',
                        user: userName,
                        value: function (layout) {
                            return _.any(layout.ratings, {assignedBy: userName});
                        }
                    };

                    $scope.pager.layoutFilters.push(filterObject)
                }
            });

        $scope.getAssignedRating = function (layout) {
            if ($scope.pager.layoutFilter.mode === 'view') {
                return _.find(layout.ratings, {'assignedBy': $scope.pager.layoutFilter.user}).value;
            } else {
                return '';
            }
        };

    }

})();


// jQuery - Angular selector link
$(function () {

    var $scope = angular.element($('#sgRatingsCtrl')).scope();

    $(window).load(function () {
        if ($scope) {
            $scope.$apply(function () {
                $scope.resetDR();
            })
        }
    });

});
