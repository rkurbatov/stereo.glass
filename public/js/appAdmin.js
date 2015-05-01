var app = angular.module('sgAppAdmin',
    [
        'smart-table',
        'angularUtils.directives.dirPagination',
        'daterangepicker',
        'ui.bootstrap',
        'ngCookies'
    ])
    .controller('sgUsersCtrl', ['$scope', '$http', '$sce', '$modal', '$cookies', sgUsersCtrl])
    .controller('sgCatCtrl', ['$scope', '$http', sgCatCtrl])
    .controller('sgRatingsCtrl', ['$scope', '$http', '$sce', '$modal', sgRatingsCtrl])
    .directive('sgOnImgload', ['$parse', sgOnImgload]);

function sgUsersCtrl($scope, $http, $sce, $modal, $cookies) {
    'use strict';

    $scope.usermail = $cookies.usermail || '';

    $scope.loadData = function () {
        $http.get('/api/users').then(function (response) {
            $scope.rowCollection = response.data;
        });
    };

    $scope.loadData();

    $scope.confirmRemove = function(name, id) {
        var modalScope = $scope.$new(true);
        modalScope.text = $sce.trustAsHtml("Вы действительно желаете удалить пользователя <b>" + name + "</b>?");

        var modalInstance = $modal.open({
            templateUrl : '/partials/modalYesNo',
            controller : sgYesNoModalCtrl,
            scope : modalScope,
            size : 'sm'
        });

        modalInstance.result.then(function(){
            $http.delete('/api/users', {
                params: {'_id': id}
            }).then(function (response) {
                if (response.status === 200) $scope.loadData();
            });
        });
    }
}

function sgYesNoModalCtrl($scope, $modalInstance) {
  
  $scope.ok = function () {
        $modalInstance.close();
  }

  $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
  };  
}

function sgRatingsCtrl($scope, $http, $sce, $modal) {
    'use strict';

    $scope.loadData = function () {
        $http.get('/api/layouts').then(function (response) {
            $scope.layouts = response.data;
        });
    };

    $scope.reset = function (sel) {
        $(sel).each(function () {
            $(this).selectpicker('deselectAll');
        });
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

function modalPopUpCtrl($scope, $modalInstance) {

    $scope.imgIsLoading = true;

    changeUrl();

    $scope.loaded = function () {
        $scope.imgIsLoading = false;
    };

    $scope.prevImg = prevImg;

    $scope.nextImg = nextImg;

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

    // handling left-right arrow keys
    var $doc = angular.element(document);

    $doc.on('keydown', keyHandler);

    $scope.$on('$destroy', function () {
        $doc.off('keydown', keyHandler);
    });

    function keyHandler(e) {
        if (e.keyCode === 37) $scope.$apply(prevImg);
        if (e.keyCode === 39) $scope.$apply(nextImg);
    }

    function prevImg() {
        if ($scope.idx === 0) return;
        else $scope.idx -= 1;
        changeUrl();
    }

    function nextImg() {
        if ($scope.idx === $scope.lts.length - 1) return;
        else $scope.idx += 1;
        changeUrl();
    }

    function changeUrl() {
        $scope.imgIsLoading = true;
        $scope.imgUrl = '/uploads/' + $scope.lts[$scope.idx].urlDir +
        '/' + $scope.lts[$scope.idx].url2d;

    }
}

function sgCatCtrl($scope, $http) {
    'use strict';

    $http({
        url: '/api/categories',
        method: 'GET',
        params: {catname: 'colors'}
    }).then(function (response) {
        var tmpData = catToHtml(response.data);
        $('#colors-selector').html(tmpData).selectpicker('refresh');
        $('#rate-colors-selector').html(tmpData).selectpicker('refresh');
    });

    $http({
        url: '/api/categories',
        method: 'GET',
        params: {catname: 'assortment'}
    }).then(function (response) {
        var tmpData = catToHtml(response.data);
        $('#assortment-selector').html(tmpData).selectpicker('refresh');
        $('#rate-assortment-selector').html(tmpData).selectpicker('refresh');
    });

    $http({
        url: '/api/categories',
        method: 'GET',
        params: {catname: 'plots'}
    }).then(function (response) {
        var tmpData = catToHtml(response.data);
        $('#plots-selector').html(tmpData).selectpicker('refresh');
        $('#rate-plots-selector').html(tmpData).selectpicker('refresh');
    });

    // fill countries selector and remove has-error class
    $http({
        url: '/api/categories',
        method: 'GET',
        params: {catname: 'countries'}
    }).then(function (response) {
        $('#countries-selector')
            .html(catToHtml(response.data))
            .selectpicker('refresh')
            .selectpicker('val', 'international')
            .parent('.form-group.sg-validable').removeClass('has-error');
        $('#rate-countries-selector').html(catToHtml(response.data)).selectpicker('refresh');

    });

}

function sgOnImgload($parse) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var fn = $parse(attrs.sgOnImgload);
            elem.on('load', function (event) {
                scope.$apply(function () {
                    fn(scope, {$event: event});
                });
            });
        }
    }
}

function catToHash(arr) {
    var result = {};

    arr.forEach(parseLeaves);

    function parseLeaves(el) {
        if (el.leaves) {
            el.leaves.forEach(function(item){
               result[item.value] = (!el.subCatName || el.subCatName === "") ? item.name : el.subCatName + ' - ' + item.name;
            });
        }
    }

    return result;
}

function catToHtml(arr) {
    return arr.map(workOnGroup).join('');

    function workOnGroup(el) {
        var preS, postS;
        if (el.subCatName !== '') {
            preS = '<optgroup label="' + el.subCatName + '">';
            postS = '</optroup>';
        }
        else {
            preS = '';
            postS = '';
        }

        return (preS + el.leaves.map(function (nel) {
            var subtext = nel.subtext ? ' data-subtext="' + nel.subtext + '"' : '',
                icon = nel.icon ? ' data-icon="' + nel.icon + '"' : '',
                name = nel.name ? nel.name : ''; // if name is undefined

            return '<option value="' + nel.value + '"' + subtext + icon + '>' + name + '</option>';

        }).join('') + postS);
    }
}