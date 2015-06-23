function sgLayoutItemCtrl($scope) {

    $scope.setSelectedIndex = function (index) {
        $scope.pager.selectedIndex = ($scope.pager.curPage - 1) * $scope.pager.ipp + index;
    };

    $scope.getSelectedIndex = function() {
        return $scope.pager.selectedIndex - ($scope.pager.curPage-1) * $scope.pager.ipp;
    };

}