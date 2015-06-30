function sgYesNoModalCtrl($scope) {

    $scope.ok = function () {
        $scope.result = $scope.result || {};
        $scope.$close($scope.result);
    };

    $scope.cancel = function () {
        $scope.$dismiss('cancel');
    };
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
        else {
            // autoset rating 0
            if (($scope.lts[$scope.idx]).rating === -1) {
                ($scope.lts[$scope.idx]).rating = 0;
            }
            $scope.idx -= 1;
        }
        changeUrl();
    }

    function nextImg() {
        if ($scope.idx === $scope.lts.length - 1) return;
        else {
            // autoset rating 0
            if (($scope.lts[$scope.idx]).rating === -1) {
                ($scope.lts[$scope.idx]).rating = 0;
            }
            $scope.idx += 1;
        }
        changeUrl();
    }

    function changeUrl() {
        $scope.imgIsLoading = true;
        $scope.imgUrl = '/uploads/' + $scope.lts[$scope.idx].urlDir +
            '/' + $scope.lts[$scope.idx].url2d;

    }
}

