// directive runs function on image load

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