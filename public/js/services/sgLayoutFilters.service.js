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
                    name: "только оцененные и просмотренные мной",
                    mode: 'byLayout',
                    value: function (v) {
                        v.compareValue = v.average;
                        return v.rating > -1 && !v.isHidden;
                    }
                }
            ],
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
            currentClient: {},
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
            }
        };

        initService();

        return filters;

        function initService() {
            filters.currentOrder = filters.order[0];
            filters.currentClient = filters.client[0];

            // add to filters array filter by founder name
            sgUsers.getRaters()
                .then(function (raters) {
                    _.forEach(raters, addFilter);

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
                    filters.client.push(filters.currentRaterFilter);

                });

            // add to filters 'assigned to designer' filters.
            if (sgUsers.currentUser.role === 'admin' || sgUsers.currentUser.role === 'founder') {
                sgUsers.getDesigners()
                    .then(function(designers){
                        _.forEach(designers, addFilter);

                        function addFilter(designerName) {
                            var filterObject = {
                                designer: designerName,
                                value: function (layout) {
                                    layout.compareValue = layout.status;
                                    return layout.assignedTo === designerName;
                                }
                            };
                            filters.designers.push(filterObject)
                        }

                        filters.currentDesigner = filters.designers[0];
                        filters.currentDesignerFilter.value = filters.currentDesigner.value;
                        filters.client.push(filters.currentDesignerFilter);

                    });
            }

            // add to filters 'deleted' filter
            if (sgUsers.currentUser.role === 'admin') {
                filters.client.push(
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

            

        }
    }

})();