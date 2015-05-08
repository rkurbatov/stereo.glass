function sgRatingsCtrl($scope, $http, $sce, $modal, $cookies) {
    'use strict';

    $scope.pager = {};

    // Init controller

    $scope.selection = {};
    $scope.designers = [];

    // Paginator init
    $scope.pager = {
        ipps : [12, 18, 24, 36],    // possible images per page values
        curPage : 1,
        selectedIndex : -1,     // default - unselected
        layoutOrders : [
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
        ]
    };

    $scope.pager.ipp  = $scope.pager.ipps[0];              // default IPP
    $scope.pager.layoutOrder = $scope.pager.layoutOrders[0];


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

    $http({
        url: '/api/categories',
        method: 'GET',
        params: {catname: 'assortment'}
    }).then(function (response) {
        $scope.assortmentHash = catToHash(response.data);
    });

    $http.get('/api/categories', {
        params: {
            catname: 'plots'
        }
    }).then(function (response) {
        $scope.plotsHash = catToHash(response.data);
    });

    $http.get('/api/categories', {
        params: {catname: 'countries'}
    })
        .then(function (response) {
            $scope.countriesHash = catToHash(response.data);
        });

    $http.get('/api/users', {
        params: {roles: JSON.stringify(['designer'])}
    })
        .then(function (response) {
            $scope.designers = response.data.map(function (el) {
                return el.username
            });
            $('#rate-designer-selector').html(arrToOptions($scope.designers)).selectpicker('refresh');
        });

    // Fill paginator

    $scope.loadData = function () {

        if ($scope.dateRange.startDate) $scope.selection.fromDate = $scope.dateRange.startDate.toDate();
        if ($scope.dateRange.endDate) $scope.selection.toDate = $scope.dateRange.endDate.toDate();

        $http.get('/api/layouts', {
            params: {
                selection: JSON.stringify($scope.selection)
            }
        }).then(function (response) {
            $scope.layouts = response.data.map(function(e){
                // get rating, set by current user or -1
                e.rating = (_.pluck(_.where(e.ratings, {'assignedBy': $cookies.username}), 'value')[0]) || -1;
                // needed for correct order
                e.average = e.average || -1;
                return e;
            });
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
                if (response.status === 200) $scope.loadData();
            });
        });
    };

    $scope.$watch('dateRange', $scope.loadData, true);

    $scope.setSelectedIndex = function (idx) {
        $scope.pager.selectedIndex = idx
    }
}

// jQuery - Angular selector link

$(function () {

    var $scope = angular.element($('#sgRatingsCtrl')).scope();

    $(
        '#rate-colors-selector, #rate-assortment-selector, #rate-plots-selector,'
        + ' #rate-countries-selector, #rate-designer-selector'
    ).on('change', function () {
            var self = this;

            $scope.$apply(function () {
                console.log($(self).attr('id'));

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
