(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .factory('sgLayoutFilters', sgLayoutFilters);

    sgLayoutFilters.$inject = ['sgUsers'];

    function sgLayoutFilters(sgUsers) {
        var filters = {
            order: [
                {
                    name: "По дате (от новых к старым)",
                    value: ['-createdAt']
                },
                {
                    name: "По дате (от старых к новым)",
                    value: ['createdAt']
                },
                {
                    name: "По убыванию рейтинга",
                    value: ['-compareValue']
                },
                {
                    name: "По возрастанию рейтинга",
                    value: ['compareValue']
                },
                {
                    name: "По уменьшению числа оценок",
                    value: ['-ratings.length']
                },
                {
                    name: "По увеличению числа оценок",
                    value: ['ratings.length']
                }
            ],
            rating: [
                {
                    name: "все",
                    mode: 'byLayout',
                    value: function (v) {
                        v.compareValue = v.average;
                        return !v.isHidden;
                    }
                },
                {
                    name: "еще не просмотренные",
                    mode: 'byLayout',
                    value: function (v) {
                        return (v.rating === -1 || v.notRatedByMe) && !v.isHidden;
                    }
                },
                {
                    name: "оцененные и просмотренные мной",
                    mode: 'byLayout',
                    value: function (v) {
                        v.compareValue = v.average;
                        return v.rating > -1 && !v.isHidden;
                    }
                },
                {
                    name: "с комментариями",
                    mode: 'byLayout',
                    value: function (v) {
                        v.compareValue = v.comments.length;
                        return v.comments.length;
                    }
                }
            ],
            progress: [],
            raters: [],
            designers: [],
            server: {
                assortment: [],
                colors: [],
                countries: [],
                plots: [],
                designers: []
            },
            currentOrder: {},
            currentRating: {},
            currentProgress: {},
            currentServer: {},
            currentRater: {},
            currentRaterFilter: {
                name: "оцененные пользователем",
                mode: "byRater"
            },
            currentDesigner: {},
            currentDesignerFilter: {
                name: "назначенные дизайнеру",
                mode: "byDesigner"
            },
            dateRange: {
                startDate: null,
                endDate: null
            }
        };

        initService();

        return filters;

        function initService() {
            filters.currentOrder = filters.order[0];
            filters.currentRating = filters.rating[0];

            // add to filters array filter by founder name
            sgUsers.loaded
                .then(function () {
                    _.forEach(sgUsers.raters, addFilter);

                    function addFilter(userName) {
                        var filterObject = {
                            user: userName,
                            value: function (layout) {
                                layout.compareValue = (_.find(layout.ratings, {assignedBy: userName}) || {}).value;
                                return _.any(layout.ratings, {assignedBy: userName});
                            }
                        };
                        filters.raters.push(filterObject)
                    }

                    filters.currentRater = filters.raters[0];
                    filters.currentRaterFilter.value = filters.currentRater.value;
                    filters.rating.push(filters.currentRaterFilter);

                });

            // add to filters 'assigned to designer' filters.
            if (_.contains(['admin', 'founder', 'curator', 'designer'], sgUsers.currentUser.role)) {
                sgUsers.loaded
                    .then(function () {

                        var allFilter = {
                            designer: "всем",
                            value: function (layout) {
                                layout.compareValue = layout.average;
                                return _.contains(["assigned", "accepted", "rejected"], layout.status);
                            }
                        };

                        filters.designers.unshift(allFilter);

                        _.forEach(sgUsers.designers, addFilter);

                        function addFilter(designerName) {

                            var filterObject = {
                                designer: (sgUsers.currentUser.role === 'designer' && sgUsers.currentUser.name === designerName)
                                    ? 'мне'
                                    : designerName,
                                value: function (layout) {
                                    layout.compareValue = layout.status;
                                    return layout.assignedTo === designerName;
                                }
                            };

                            // place own name at the beginning
                            (sgUsers.currentUser.role === 'designer' && sgUsers.currentUser.name === designerName)
                                ? filters.designers.unshift(filterObject)
                                : filters.designers.push(filterObject);

                        }

                        filters.currentDesigner = filters.designers[0];
                        filters.currentDesignerFilter.value = filters.currentDesigner.value;
                        filters.progress.push(filters.currentDesignerFilter);
                        filters.currentProgress = filters.progress[0];

                    });
            }

            // add to filters 'deleted' filter
            sgUsers.loaded
                .then(function () {
                    if (sgUsers.currentUser.role === 'admin') {
                        filters.rating.push(
                            {
                                name: 'удалённые',
                                mode: 'byLayout',
                                value: function (layout) {
                                    layout.compareValue = layout.average;
                                    return layout.isHidden;
                                }
                            }
                        );
                    }
                });
        }
    }

})(window, window.angular);