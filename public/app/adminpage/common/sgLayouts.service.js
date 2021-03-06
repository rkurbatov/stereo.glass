(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLayouts', sgLayouts);

    sgLayouts.$inject = ['$http', '$q', 'sgUsers', 'sgLayoutFilters'];

    function sgLayouts($http, $q, sgUsers, sgLayoutFilters) {

        // ==== DECLARATION =====

        var svc = this;
        _.extend(svc, {
            unratedCount: 0,
            rawLayouts: [],
            loadData,
            removeMyRating, changeMyRating,
            remove, restore, update,
            getThumbUrl, getImgUrl,
            addComment
        });

        // TODO: check if unratedCount is correct after delete

        // === IMPLEMENTATION ===

        function loadData() {

            var selection = sgLayoutFilters.server;

            return $http
                .get('/api/layouts', {
                    params: {
                        selection: JSON.stringify(selection)
                    }
                })
                .then((response)=> {
                    svc.unratedCount = 0;
                    var transformedData = _.map(response.data, (layout)=> {
                        // get rating, set by current user or -1
                        var rating = _.map(_.filter(layout.ratings, {'assignedBy': sgUsers.currentUser.name}), 'value')[0];
                        if (rating >= 0) {
                            layout.rating = rating;
                        } else {
                            layout.rating = -1;
                            // Hack to prevent early filtering (hiding rated layouts)
                            layout.notRatedByMe = true;
                            if (!layout.isHidden) {
                                svc.unratedCount += 1;
                            }
                        }
                        // needed for correct order
                        layout.average = calcAverageRating(layout.ratings);

                        return layout;
                    });

                    // replace old value to store reference
                    svc.rawLayouts.length = 0;
                    _.forEach(transformedData, (v)=> svc.rawLayouts.push(v));
                });
        }

        function removeMyRating(layout) {
            if (layout.isProcessing) {
                return $q.reject();
            }

            var idx = _.findIndex(layout.ratings, {assignedBy: sgUsers.currentUser.name});
            if (~idx) {
                return $http
                    .delete('/api/layouts/' + layout['_id'] + '/rating')
                    .then(function (response) {
                        if (response.status === 204) {
                            layout.ratings.splice(idx, 1);
                            layout.rating = -1;
                            layout.average = calcAverageRating(layout.ratings);
                            layout.notRatedByMe = true;
                            svc.unratedCount += 1;
                        }
                        if (layout.isProcessing) delete layout.isProcessing;
                    });
            } else {
                if (layout.isProcessing) delete layout.isProcessing;
                return $q.reject();
            }
        }

        function changeMyRating(layout, value) {
            var idx = _.findIndex(layout.ratings, {assignedBy: sgUsers.currentUser.name});
            return $http
                .put('/api/layouts/' + layout['_id'] + '/rating/' + value)
                .then(function (result) {
                    if (result.status !== 200) return $q.reject('Rating error: ' + result.status);
                    if (~idx) { // rating exists
                        layout.ratings[idx].value = value;
                    } else { // new rating
                        layout.ratings.push({
                            value: value,
                            assignedBy: sgUsers.currentUser.name
                        });
                        svc.unratedCount -= 1;
                        layout.notRatedByMe = false;
                    }
                    layout.average = calcAverageRating(layout.ratings);
                });
        }

        function remove(id) {
            return update(id, {status: 'deleted'});
        }

        function restore(id) {
            return update(id, {}, ['status']);
        }

        function update(id, setObject, unsetArray) {
            if (!setObject && !unsetArray) {
                return $q.reject();
            }

            var params = {};
            if (setObject) {
                params.setObject = setObject
            }

            if (unsetArray) {
                params.unsetArray = unsetArray
            }

            return $http.put('/api/layouts/' + id, {params: params});
        }

        function calcAverageRating(rateArr) {
            var coef = {
                1: 1,
                2: 2,
                3: 3
            };

            var avg;

            if (rateArr.length === 0) {
                return 0
            } else {
                // mean of ratings, taken from coefficient table.
                avg = _.sum(_.map(_.map(rateArr, 'value'), (e)=> {
                        return coef[e]
                    })) / _.size(rateArr);
                return Number(avg.toFixed(2));
            }
        }

        function getThumbUrl(layout, viewMode, selected) {
            var img = (
                selected
                && _.contains(['finished', 'approved'], layout.status)
                && _.contains(['Ready', 'Shop'], viewMode)
            )
                ? layout.urlGifLoRes
                : layout.urlThumb;
            return '/uploads/' + (layout.reference
                    ? 'ready/'
                    : 'pictures/') + layout.urlDir + '/' + img;
        }

        function getImgUrl(layout) {
            return '/uploads/' + (layout.reference
                    ? 'ready/'
                    : 'pictures/') + layout.urlDir + '/' + layout.url2d;
        }

        function addComment(layout, text) {
            var newComment = {
                postedBy: sgUsers.currentUser.name,
                postedAt: new Date(),
                text: text
            };

            return $http
                .post('/api/layouts/comment/' + layout._id, {
                    params: newComment
                })
                .then(function () {
                    layout.comments = layout.comments || [];
                    layout.comments.push(newComment);
                });
        }
    }

})(window, window.angular);