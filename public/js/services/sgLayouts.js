(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLayouts', sgLayouts);

    sgLayouts.$inject = ['$http', '$q', 'sgUsers'];

    function sgLayouts($http, $q, sgUsers) {

        this.loadData = loadData;
        this.removeMyRating = removeMyRating;
        this.changeMyRating = changeMyRating;
        this.removeLayout = removeLayout;

        function loadData(filters) {

            var selection = {
                catColors: filters.colors.selection,
                catAssortment: filters.assortment.selection,
                catCountries: filters.countries.selection,
                catPlots: filters.plots.selection,
                designers: filters.designers.selection
            };

            return $http.get('/api/layouts', {
                params: {
                    selection: JSON.stringify(selection)
                }
            }).then(function (response) {
                return response.data.map(function (e) {
                    // get rating, set by current user or -1
                    var rating = _.pluck(_.where(e.ratings, {'assignedBy': sgUsers.currentUser.name}), 'value')[0];
                    if (rating >= 0) {
                        e.rating = rating;
                    } else {
                        e.rating = -1;
                        // Hack to prevent early filtering (hiding rated layouts)
                        e.notRatedByMe = true;
                    }
                    // needed for correct order
                    e.average = calcAverageRating(e.ratings);
                    return e;
                });
            });
        }

        function removeMyRating(layout) {
            var idx = _.findIndex(layout.ratings, {assignedBy: sgUsers.currentUser.name});
            if (~idx) {
                console.log(layout.ratings);
                $http.delete('/api/layout/' + layout['_id'] + '/rating')
                    .then(function (response) {
                        if (response.status === 204) {
                            layout.ratings.splice(idx, 1);
                            layout.rating = -1;
                            layout.average = calcAverageRating(layout.ratings);
                        }
                    });
            }
        }

        function changeMyRating(layout, value) {
            var idx = _.findIndex(layout.ratings, {assignedBy: sgUsers.currentUser.name});
            return $http.put('/api/layout/' + layout['_id'] + '/rating/' + value)
                .then(function (result) {
                    if (result.status !== 200) return $q.reject('Rating error: ' + result.status);
                    if (~idx) { // rating exists
                        layout.ratings[idx].value = value;
                    } else { // new rating
                        layout.ratings.push({
                            value: value,
                            assignedBy: sgUsers.currentUser.name
                        });
                    }
                    layout.average = calcAverageRating(layout.ratings);
                });
        }

        function removeLayout(id) {
            return $http.delete('/api/layouts/' + id)
                .success(function (response) {
                    return response.status === 204
                        ? $q.resolve()
                        : $q.reject();
                });
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
                avg = _.sum(_.map(_.pluck(rateArr, 'value'), function (e) {
                        return coef[e]
                    })) / _.size(rateArr);
                return Number(avg.toFixed(2));
            }
        }
    }
})();