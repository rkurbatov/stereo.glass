function sgLayoutItemCtrl($scope) {

    $scope.$watch('layout.rating', function (newValue, oldValue) {
        var idx, rs;

        if (newValue) {
            rs = $scope.layout.ratings;
            idx = _.findIndex(rs, {assignedBy: $scope.username});

            if (idx > -1) {         // rating exists
                rs[idx].value = newValue;
                rs[idx].assignedAt = new Date();
            } else {                // new rating
                rs.push({
                    value: newValue,
                    assignedBy: $scope.username,
                    assignedAt: new Date()
                });
            }
            console.log(rs);
        }
    });

}