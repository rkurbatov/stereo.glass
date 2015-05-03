function sgRatingsCtrl($scope, $http, $sce, $modal) {
    'use strict';

    // Init controller

    $scope.selection = {};
    $scope.designers = [];

    $http({
        url: '/api/categories',
        method: 'GET',
        params: {catname: 'assortment'}
    }).then(function (response) {
        $scope.assortmentHash = catToHash(response.data);
    });

    $http({
        url: '/api/categories',
        method: 'GET',
        params: {catname: 'plots'}
    }).then(function (response) {
        $scope.plotsHash = catToHash(response.data);
    });

    $http({
        url: '/api/categories',
        method: 'GET',
        params: {catname: 'countries'}
    }).then(function (response) {
        $scope.countriesHash = catToHash(response.data);
    });

    $http.get('/api/users', {
        params: {
            roles : JSON.stringify(['designer'])
        }
    }).then(function (response) {
        $scope.designers = response.data.map(function(el){
            return el.username
        });
        $('#rate-designer-selector').html(arrToOptions($scope.designers)).selectpicker('refresh');
    });


    $scope.loadData = function () {
        $http.get('/api/layouts', {
            params: {
                selection: JSON.stringify($scope.selection)
            }    
        }).then(function (response) {
            $scope.layouts = response.data;
        });

    };

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

    $scope.resetDR = function () {
        $('#rate-daterange').val('');
    };

    $scope.resetAll = function () {
        $scope.reset('#admin-ratings .selectpicker');
        $scope.resetDR();
    };

    $scope.loadData();

    $scope.ipp = 12;
    $scope.curPage = 1;
    $scope.selectedIndex = -1;

    $scope.itemClicked = function (index) {
        $scope.selectedIndex = ($scope.curPage - 1) * $scope.ipp + index;
    };

    $scope.date = {
        startDate: null,
        endDate: null
    };

    $scope.dpopts = {
        todayHighlight: true,
        endDate: moment(),
        language: 'ru',
        locale: {
            applyClass: 'btn-green',
            applyLabel: "Применить",
            fromLabel: "С",
            toLabel: "по",
            cancelLabel: 'Отмена',
            customRangeLabel: 'Свой интервал'
        },
        ranges: {
            'За неделю': [moment().subtract('days', 6), moment()],
            'За 30 дней': [moment().subtract('days', 29), moment()]
        }
    };

    $scope.getColors = function () {
        if ($scope.selectedIndex === -1) return '';

        return $sce.trustAsHtml($scope.layouts[$scope.selectedIndex].catColors.map(function (v) {
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

    $scope.getValues = function(cat, hash) {
        if ($scope.selectedIndex === -1) return '';

        return $scope.layouts[$scope.selectedIndex][cat].map(function (el){
            return $scope[hash][el];
        }).join(', ');
    };

    $scope.show2dModal = function () {
        if ($scope.selectedIndex === -1 || $scope.layouts[$scope.selectedIndex].url2d === '') return undefined;

        var modalScope = $scope.$new(true);
        modalScope.idx = $scope.selectedIndex;
        modalScope.lts = $scope.layouts;

        $scope.modalImg = $modal.open({
            templateUrl: '/partials/modalimg',
            controller: modalPopUpCtrl,
            scope: modalScope,
            size: 'lg'
        });

    };

    $scope.confirmRemove = function(idx) {
        var modalScope = $scope.$new(true);
        var layout = $scope.layouts[$scope.selectedIndex];
        var id = layout['_id'];

        modalScope.url = '/uploads/' + layout.urlDir + '/' + layout.urlThumb;

        var modalInstance = $modal.open({
            templateUrl : '/partials/modalYesNoImage',
            controller : sgYesNoModalCtrl,
            scope : modalScope,
            size : 'sm'
        });

        modalInstance.result.then(function(){
            $http.delete('/api/layouts', {
                params: {'_id': id}
            }).then(function (response) {
                if (response.status === 200) $scope.loadData();
            });
        });
    }
}

$(function(){
   
    var $scope = angular.element($('#sgRatingsCtrl')).scope();

    $('#rate-colors-selector').on('change', function(){
        var self = this;

        $scope.$apply(function(){
            $scope.selection.catColors = $(self).val();
            $scope.loadData();
        })
    });

    $('#rate-assortment-selector').on('change', function(){
        var self = this;

        $scope.$apply(function(){
            $scope.selection.catAssortment = $(self).val();
            $scope.loadData();
        })
    });

    $('#rate-plots-selector').on('change', function(){
        var self = this;

        $scope.$apply(function(){
            $scope.selection.catPlots = $(self).val();
            $scope.loadData();
        })
    });

    $('#rate-countries-selector').on('change', function(){
        var self = this;

        $scope.$apply(function(){
            $scope.selection.catCountries = $(self).val();
            $scope.loadData();
        })
    });

    $('#rate-designer-selector').on('change', function(){
        var self = this;

        $scope.$apply(function(){
            $scope.selection.designers = $(self).val();
            $scope.loadData();
        })
    });
});
