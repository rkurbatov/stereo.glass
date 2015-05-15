function sgLayoutItemCtrl($scope, $http) {

    $scope.itemClicked = function (index) {
        $scope.setSelectedIndex(($scope.pager.curPage - 1) * $scope.pager.ipp + index);
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

            $scope.layout.average = $scope.calcAverage($scope.layout.ratings);

            $http.put(
                '/api/layout/' + $scope.layout['_id'] + '/rating/' + newValue
            )
            .then(function(result){
                console.log(result);
            })

        }
    });

}