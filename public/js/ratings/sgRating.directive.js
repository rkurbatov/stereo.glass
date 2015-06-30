(function () {

    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgRating', sgRating);

    sgRating.$inject = ['sgLayouts'];

    function sgRating(sgLayouts) {
        var ddo = {
            restrict: 'E',
            scope: {
                linkedObject: '='
            },
            templateUrl: '/partials/ratingsDirective',
            link: link
        };

        function link(scope, elm, attrs) {

            scope.getRatingClassName = getRatingClassName;
            scope.removeRating = removeRating;
            scope.markViewed = markViewed;
            scope.oneRow = attrs.oneRow;

            scope.$watch('linkedObject.rating', function (newValue, oldValue) {
                if (newValue === oldValue || newValue === -1) return;
                sgLayouts.changeMyRating(scope.linkedObject, newValue)
                    .then(function () {
                        // Hack to prevent early filtering. Now we can filter our layout
                        // scope.linkedObject.notRatedByMe = false;
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });

            function removeRating() {
                sgLayouts.removeMyRating(scope.linkedObject);
            }

            function markViewed() {
                scope.linkedObject.rating = 0;
            }

            function getRatingClassName() {
                var avg = scope.linkedObject.average,
                    result;

                // Style for rated and unrated layouts
                result = scope.linkedObject.ratings.length > 0 ? "glyphicon-star " : "glyphicon-star-empty ";

                // Style for different ratings
                if (avg > 0 && avg <= 1) result += 'sg-bronze-i';
                else if (avg > 1 && avg < 2.5) result += 'sg-silver-i';
                else if (avg > 2.5) result += 'sg-gold-i';
                return result;
            }
        }

        return ddo;
    }

})();
