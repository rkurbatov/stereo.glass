(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .factory('sgLayoutSortOrder', sgLayoutSortOrder);

    sgLayoutSortOrder.$inject = [];

    function sgLayoutSortOrder() {

        var ratingMode = [
                {
                    name: "По дате загрузки (от новых к старым)",
                    value: ['-createdAt']
                },
                {
                    name: "По дате загрузки (от старых к новым)",
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
            ];

        var progressMode = [
            {
                name: "По дате назначения (от новых к старым)",
                value: ['-assignedAt']
            },
            {
                name: "По дате назначения (от старых к новым)",
                value: ['assignedAt']
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
            },
            {
                name: "По артикулу (от меньшего к большему)",
                value: ['reference']
            },
            {
                name: "По артикулу (от большего к меньшему)",
                value: ['-reference']
            }
        ];

        var readyMode = [
            {
                name: "По дате завершения (от новых к старым)",
                value: ['-finishedAt']
            },
            {
                name: "По дате завершения (от старых к новым)",
                value: ['finishedAt']
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
            },
            {
                name: "По артикулу (от меньшего к большему)",
                value: ['reference']
            },
            {
                name: "По артикулу (от большего к меньшему)",
                value: ['-reference']
            }
        ];

        var shopMode = [
            {
                name: "По дате добавления (от новых к старым)",
                value: ['-approvedAt']
            },
            {
                name: "По дате добавления (от старых к новым)",
                value: ['approvedAt']
            },
            {
                name: "По артикулу (от меньшего к большему)",
                value: ['reference']
            },
            {
                name: "По артикулу (от большего к меньшему)",
                value: ['-reference']
            }
        ];

        return {
            Rating: ratingMode,
            Progress: progressMode,
            Ready: readyMode,
            Shop: shopMode,
            current: {}
        };
    }

})(window, window.angular);