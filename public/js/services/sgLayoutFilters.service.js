(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .factory('sgLayoutFilters', sgLayoutFilters);

    sgLayoutFilters.$inject = ['sgUsers'];

    function sgLayoutFilters(sgUsers) {
        var filters = {
            order: [
                {
                    name: "По дате (от старых к новым)",
                    value: ['createdAt']
                },
                {
                    name: "По дате (от новых к старым)",
                    value: ['-createdAt']
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
                    name: "По уменьшению числа оценивших",
                    value: ['-ratings.length']
                },
                {
                    name: "По увеличению числа оценивших",
                    value: ['ratings.length']
                }
            ],
            client: [
                {
                    name: "все",
                    mode: 'rate',
                    value: function (v) {
                        v.compareValue = v.average;
                        return !v.isHidden;
                    }
                },
                {
                    name: "еще не просмотренные",
                    mode: 'rate',
                    value: function (v) {
                        return (v.rating === -1 || v.notRatedByMe) && !v.isHidden;
                    }
                },
                {
                    name: "только оцененные и просмотренные мной",
                    mode: 'rate',
                    value: function (v) {
                        v.compareValue = v.average;
                        return v.rating > -1 && !v.isHidden;
                    }
                }
            ],
            server: {
                assortment: [],
                colors: [],
                countries: [],
                plots: [],
                designers: []
            },
            currentOrder: {},
            currentClient: {},
            currentServer: {}
        };

        initService();

        return filters;

        function initService() {
            filters.currentOrder = filters.order[0];
            filters.currentClient = filters.client[0];

            // add to filters 'deleted' filter
            if (sgUsers.currentUser.role === 'admin') {
                filters.client.push(
                    {
                        name: 'удалённые',
                        mode: 'rate',
                        value: function (layout) {
                            v.compareValue = v.average;
                            return layout.isHidden;
                        }
                    }
                );
            }

            // add to filters array filter by founder name
            sgUsers.getRaters()
                .then(function (raters) {
                    _.forEach(raters, addFilter);

                    function addFilter(userName) {
                        var filterObject = {
                            name: 'оцененные ' + userName,
                            mode: 'view',
                            user: userName,
                            value: function (layout) {
                                layout.compareValue = (_.find(layout.ratings, {assignedBy: userName}) || {}).value;
                                return _.any(layout.ratings, {assignedBy: userName});
                            }
                        };

                        filters.client.push(filterObject)
                    }
                });
        }
    }

})();