function sgLayoutItemCtrl($scope, $http) {

    $scope.itemClicked = function (index) {
        $scope.setSelectedIndex(($scope.pager.curPage - 1) * $scope.pager.ipp + index);
        console.log($scope.layouts[($scope.pager.curPage - 1) * $scope.pager.ipp + index])
    };


    $scope.$watch('layout.rating', function (newValue, oldValue) {

        if (newValue === oldValue || newValue === -1) return;

        var idx, rs;

        if (newValue) {
            rs = $scope.layout.ratings;
            idx = $scope._.findIndex(rs, {assignedBy: $scope.username});

            if (idx > -1) {         // rating exists
                rs[idx].value = newValue;
            } else {                // new rating
                rs.push({
                    value: newValue,
                    assignedBy: $scope.username
                });
            }

            $scope.layout.average = calcAverage($scope.layout.ratings);

            $http.put(
                '/api/layout/' + $scope.layout['_id'] + '/rating/' + newValue + '/average/' + $scope.layout['average']
            )
            .then(function(result){
                console.log(result);
            })

        }
    });

    var calcAverage = function(rateArr){

        var coef = {
            1: 0,
            2: 1,
            3: 3    
        };

        var avg;

        if (rateArr.length === 0) {
            return 0
        } else {
            // mean of ratings, taken from coefficient table.
            avg = _.sum( _.map(_.pluck(rateArr, 'value'), function (e) {return coef[e]})) / _.size(rateArr);
            return Number(avg.toFixed(2));
        }   

    }


}