(function (window, angular, undefined) {

    'use strict';

    angular
        .module('sgAppAdmin')
        .directive('sgRating', sgRating);

    sgRating.$inject = ['sgLayouts', 'sgUsers', 'toastr'];

    function sgRating(sgLayouts, sgUsers, toastr) {
        var ddo = {
            restrict: 'E',
            scope: {
                linkedObject: '='
            },
            templateUrl: '/partials/directives-sgRating',
            link: link
        };

        function link(scope, elm, attrs) {

            scope.getRatingClassName = getRatingClassName;
            scope.removeRating = removeRating;
            scope.markViewed = markViewed;
            scope.oneRow = attrs.oneRow;
            scope.isAuthor = sgUsers.currentUser.name === scope.linkedObject.createdBy;

            var toastrInfoConfig = {
                allowHtml: true,
                timeOut: 750
            };
            var toastrErrorConfig = {
                closeButton: true,
                timeOut: 0
            };

            var toastrMsg;

            scope.$watch('linkedObject.rating', function (newValue, oldValue) {
                if (newValue === oldValue || newValue === -1) return;
                sgLayouts.changeMyRating(scope.linkedObject, newValue)
                    .then(function () {
                        newValue
                            ? toastrMsg = _.repeat('<i class="fa fa-star"></i>', newValue)
                            : toastrMsg = '<i class="fa fa-thumbs-down"></i>';
                        if (!attrs.secondInstance) {
                            toastr.info(toastrMsg, toastrInfoConfig);
                        }
                    })
                    .catch(function (err) {
                        if (!attrs.secondInstance) {
                            toastr.error(err, toastrErrorConfig);
                        }
                    });
            });

            function removeRating() {
                if (scope.isAuthor || scope.linkedObject.notRatedByMe) return;

                sgLayouts.removeMyRating(scope.linkedObject)
                    .then(function () {
                    });
                scope.linkedObject.isProcessing = true;
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

})(window, window.angular);
