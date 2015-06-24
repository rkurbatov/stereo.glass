(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('sgRatingsCtrl', sgRatingsCtrl);

    sgRatingsCtrl.$inject = ['$scope', '$http', '$sce', '$modal', '$cookies', 'sgCategories', 'sgLayouts'];

    function sgRatingsCtrl($scope, $http, $sce, $modal, $cookies, sgCategories, sgLayouts) {

        // Init controller

        $scope.selection = {};
        $scope.designers = [];

        // Paginator init
        $scope.pager = {
            ipps: [12, 18, 24, 36],    // possible images per page values
            curPage: 1,
            selectedIndex: -1,     // default - unselected
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
                    name: "Показывать все",
                    value: {}
                },
                {
                    name: "Скрывать оцененные и просмотренные мной",
                    value: function (v) {
                        return v.rating === -1 || v.notRatedByMe;
                    }
                },
                {
                    name: "Показать только оцененные и просмотренные мной",
                    value: function (v) {
                        return v.rating > -1;
                    }
                }
            ]
        };

        $scope.pager.ipp = $scope.pager.ipps[0];              // default IPP
        $scope.pager.layoutOrder = $scope.pager.layoutOrders[0];
        $scope.pager.layoutFilter = $scope.pager.layoutFilters[0];

        $scope.username = $cookies.username;

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
                customRangeLabel: 'Другой интервал',
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

        // Fill designers list
        $http.get('/api/authors')
            .success(function (authors) {
                $scope.designers = _.pluck(authors, '_id');
                $('#rate-designer-selector').html(arrToOptions($scope.designers)).selectpicker('refresh');
            });

        // Fill paginator
        $scope.loadData = function () {

            if ($scope.dateRange.startDate) $scope.selection.fromDate = $scope.dateRange.startDate.toDate();
            if ($scope.dateRange.endDate) $scope.selection.toDate = $scope.dateRange.endDate.toDate();

            sgLayouts.loadData($scope.selection, $scope.username)
                .then(function (data) {
                    $scope.layouts = data;
                });

        };

        // Reset clicked selector

        $scope.reset = function (sel) {

            if ($(sel).attr('id') === 'rate-colors-selector') {
                $scope.selection.catColors = [];
            }

            if ($(sel).attr('id') === 'rate-plots-selector') {
                $scope.selection.catPlots = [];
            }

            if ($(sel).attr('id') === 'rate-assortment-selector') {
                $scope.selection.catAssortment = [];
            }

            if ($(sel).attr('id') === 'rate-countries-selector') {
                $scope.selection.Countries = [];
            }

            if ($(sel).attr('id') === 'rate-designer-selector') {
                $scope.designers = [];
            }

            $(sel).each(function () {
                $(this).selectpicker('deselectAll');
            });

            $scope.loadData();

        };

        // Reset all selectors and daterange

        $scope.resetAll = function () {
            $scope.reset('#admin-ratings .selectpicker');
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
            modalScope.setViewed = $scope.setViewed;
            modalScope.removeMyRating = $scope.removeMyRating;
            modalScope.idx = $scope.pager.selectedIndex;
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
            var id = layout['_id'];

            modalScope.url = '/uploads/' + layout.urlDir + '/' + layout.urlThumb;

            var modalInstance = $modal.open({
                templateUrl: '/partials/modalYesNoImage',
                controller: sgYesNoModalCtrl,
                scope: modalScope,
                size: 'sm'
            });

            modalInstance.result.then(function () {
                $http.delete('/api/layouts', {
                    params: {'_id': id}
                }).then(function (response) {
                    if (response.status === 200) {
                        // check if removing last added image
                        if ($scope.pager.selectedIndex === $scope.layouts.length - 1) $scope.pager.selectedIndex -= 1;
                        $scope.loadData();
                    }
                });
            });
        };

        $scope.$watch('dateRange', $scope.loadData, true);

    }

})();


// jQuery - Angular selector link

$(function () {

    var $scope = angular.element($('#sgRatingsCtrl')).scope();

    $(
        '#rate-colors-selector, #rate-assortment-selector, #rate-plots-selector,'
        + ' #rate-countries-selector, #rate-designer-selector'
    ).on('change', function () {
            var self = this;

            $scope.$apply(function () {

                if ($(self).attr('id') === 'rate-colors-selector') $scope.selection.catColors = $(self).val();
                if ($(self).attr('id') === 'rate-assortment-selector') $scope.selection.catAssortment = $(self).val();
                if ($(self).attr('id') === 'rate-plots-selector') $scope.selection.catPlots = $(self).val();
                if ($(self).attr('id') === 'rate-countries-selector') $scope.selection.catCountries = $(self).val();
                if ($(self).attr('id') === 'rate-designer-selector') $scope.selection.designers = $(self).val();

                $scope.pager.selectedIndex = -1;
                $scope.loadData();
            })

        });

    $(window).load(function () {
        if ($scope) {
            $scope.$apply(function () {
                $scope.resetDR();
            })
        }
    });

});
