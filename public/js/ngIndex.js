angular.module('SGApp', [])
    .controller('SGController', ['$scope', '$parse', SGController])
    .directive('sgPlate', sgPlate)
    .directive('sgDragPoint', sgDragPoint);


function SGController($scope, $parse) {
    var el = $('#sg-kitchen-floor');
    $scope.koef = 1.0;
    $scope.targets = $parse(el[0].attributes['data-targets'].value)($scope);

    $scope.reDraw = function () {
        el.drawPlate3D('.sg-main-sec2 .bg-room', $scope.targets);
    };

    $scope.reCalc = function () {
        var pts = {
                p1: {x: 210, y: 917}, p2: {x: 763, y: 746}, p3: {x: 1223, y: 964}, p4: {x: 582, y: 1343}
            };

        var k = $scope.koef;

        $scope.targets[1] = [(pts.p2.x - pts.p1.x)*k + Number($scope.targets[0][0]), (pts.p2.y - pts.p1.y) * k + Number($scope.targets[0][1])];
        $scope.targets[2] = [(pts.p3.x - pts.p1.x)*k + Number($scope.targets[0][0]), (pts.p3.y - pts.p1.y) * k + Number($scope.targets[0][1])];
        $scope.targets[3] = [(pts.p4.x - pts.p1.x)*k + Number($scope.targets[0][0]), (pts.p4.y - pts.p1.y) * k + Number($scope.targets[0][1])];
        console.log(pts.p2.x - pts.p1.x);
        console.log(k);
        console.log($scope.targets);
        $scope.reDraw();
    };
}

function sgPlate() {
    return {
        templateUrl: "/partials/sgplate",
        link: function (scope, element, attrs) {
            attrs.$observe('scale', function (value) {
                scope.scale = value;
            });

            scope.scale = scope.scale || 1;
        }
    }
}

function sgDragPoint() {
    return {
        scope: {
            coords: '='
        },
        restrict: "C",
        link: function (scope, element, attrs) {
            element.draggable({
                cursor: "move",
                stop: function (event, ui) {
                    scope['coords'][0] = ui.position.left / scope.$parent.scale;
                    scope['coords'][1] = ui.position.top / scope.$parent.scale;
                    scope.$parent.reDraw();
                    scope.$apply();
                }
            });
        }
    }
}