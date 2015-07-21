(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .factory('sgLayoutFilters', sgLayoutFilters);

    sgLayoutFilters.$inject = ['sgUsers'];

    function sgLayoutFilters(sgUsers) {

        var ratingMode = [
            {
                name: 'загруженные',
                subType: 'byAuthor',
                value: {}
            },
            {
                name: 'оцененные',
                subType: 'byRater',
                value: {}
            },
            {
                name: 'с комментариями',
                subType: 'byCommenter',
                value: function (layout) {
                    layout.compareValue = layout.comments.length;
                    return layout.comments.length;
                }
            },
            {
                name: 'ещё не просмотренные',
                subType: 'firstOrder',
                value: function (layout) {
                    return !layout.isHidden &&
                        (
                            layout.rating === -1
                            || layout.notRatedByMe
                        );
                }
            }
        ];

        var progressMode = [
            {
                name: 'назначенные',
                subType: 'byAssignee',
                value: {}
            },
            {
                name: 'еще не принятые',
                subType: 'firstOrder',
                value: function (layout) {
                    layout.compareValue = layout.average;
                    return !layout.isHidden && layout.status === 'assigned';
                }
            },
            {
                name: 'отклонённые',
                subType: 'firstOrder',
                value: function (layout) {
                    layout.compareValue = layout.average;
                    return !layout.isHidden && layout.status === 'rejected';
                }
            },
            {
                name: 'с комментариями',
                subType: 'byCommenter',
                value: function (layout) {
                    layout.compareValue = layout.comments.length;
                    return layout.comments.length;
                }
            }
        ];

        var readyMode = [
            {
                name: 'выполненные',
                subType: 'byAssignee',
                value: {}
            },
            {
                name: 'с комментариями',
                subType: 'byCommenter',
                value: {}
            }
        ];

        var filters = {
            Rating: ratingMode,
            Progress: progressMode,
            Ready: readyMode,

            raters: [],
            commenters: [],
            authors: [],
            assignees: [],

            current: {
                Rating: {},
                Progress: {},
                Ready: {},

                author: {},
                rater: {},
                commenter: {},
                assignee: {}
            }
        };

        initService();

        return filters;

        // IMPLEMENTATION

        function initService() {

            if (sgUsers.currentUser.role === 'admin') {
                addRemovedFilter();
            }

            sgUsers.loaded
                .then(function () {
                    _.forEach(sgUsers.authors, addAuthorFilter);
                    _.forEach(sgUsers.raters, addRaterFilter);
                    _.forEach(sgUsers.assignees, addAssigneeFilter);
                    _.forEach(sgUsers.commenters, addCommenterFilter);

                    addAllAuthorsFilter();
                    addAllCommentersFilter();
                    addAllAssigneesFilter();

                    // Set default second-order filters
                    filters.current.rater = filters.raters[0];
                    filters.current.author = filters.authors[0];
                    filters.current.commenter = filters.commenters[0];
                    filters.current.assignee = filters.assignees[0];
                    // and corresponding first-order filters
                    _.each(filters, function (modeFilters) {
                        (_.find(modeFilters, {subType: 'byRater'}) || {}).value = filters.raters[0].value;
                        (_.find(modeFilters, {subType: 'byAuthor'}) || {}).value = filters.authors[0].value;
                        (_.find(modeFilters, {subType: 'byCommenter'}) || {}).value = filters.commenters[0].value;
                        (_.find(modeFilters, {subType: 'byAssignee'}) || {}).value = filters.assignees[0].value;
                    });

                });
        }

        function addRemovedFilter() {
            ratingMode.push(
                {
                    name: 'удалённые',
                    mode: 'firstOrder',
                    value: function (layout) {
                        layout.compareValue = layout.average;
                        return layout.isHidden;
                    }
                }
            );
        }

        function addRaterFilter(raterName) {
            var filterObject = {
                rater: raterName === sgUsers.currentUser.name
                    ? 'мной'
                    : raterName,
                value: function (layout) {
                    layout.compareValue = (_.find(layout.ratings, {assignedBy: raterName}) || {}).value;
                    return !layout.isHidden && _.any(layout.ratings, {assignedBy: raterName});
                }
            };

            // place filter 'rated by me' at the beginning
            raterName === sgUsers.currentUser.name
                ? filters.raters.unshift(filterObject)
                : filters.raters.push(filterObject);
        }

        function addCommenterFilter(commenterName) {
            var filterObject = {
                commenter: commenterName === sgUsers.currentUser.name
                    ? 'мной'
                    : commenterName,
                value: function (layout) {
                    layout.compareValue = layout.average;
                    return !layout.isHidden &&
                        (
                            _.any(layout.comments, {postedBy: commenterName})
                            || (layout.designerComment && layout.createdBy === commenterName)
                            || (
                                (layout.assignedComment || layout.approvedComment)
                                && layout.assignedBy === commenterName
                            )
                            || (
                                (layout.acceptedComment || layout.finishedComment)
                                && layout.assignedTo === commenterName
                            )
                        );
                }
            };

            // place filter 'rated by me' at the beginning
            commenterName === sgUsers.currentUser.name
                ? filters.commenters.unshift(filterObject)
                : filters.commenters.push(filterObject);
        }

        function addAllCommentersFilter() {
            var filterObject = {
                commenter: 'всеми',
                value: function (layout) {
                    layout.compareValue = layout.average;
                    return !layout.isHidden
                        && (
                            layout.comments.length
                            || layout.designerComment
                            || layout.assignedComment
                            || layout.acceptedComment
                            || layout.finishedComment
                            || layout.approvedComment
                        );
                }
            };

            filters.commenters.unshift(filterObject);
        }

        function addAuthorFilter(authorName) {
            var filterObject = {
                author: authorName === sgUsers.currentUser.name
                    ? 'мной'
                    : authorName,
                value: function (layout) {
                    layout.compareValue = layout.average;
                    return !layout.isHidden && layout.createdBy === authorName;
                }
            };

            // place filter 'rated by me' at the beginning
            authorName === sgUsers.currentUser.name
                ? filters.authors.unshift(filterObject)
                : filters.authors.push(filterObject);
        }

        function addAllAuthorsFilter(){
            var filterObject = {
                author: 'всеми',
                value: function (layout) {
                    layout.compareValue = layout.average;
                    return !layout.isHidden;
                }
            };

            filters.authors.unshift(filterObject);
        }

        function addAssigneeFilter(assigneeName) {
            var filterObject = {
                assignee: sgUsers.currentUser.name === assigneeName
                    ? 'мне'
                    : assigneeName,
                value: function (layout) {
                    layout.compareValue = layout.average;
                    return !layout.isHidden && layout.assignedTo === assigneeName;
                }
            };

            // place own name at the beginning
            sgUsers.currentUser.name === assigneeName
                ? filters.assignees.unshift(filterObject)
                : filters.assignees.push(filterObject);
        }

        function addAllAssigneesFilter(assigneeName) {
            var filterObject = {
                assignee: "все",
                value: function(layout) {
                    return !layout.isHidden;
                }
            };

            filters.assignees.unshift(filterObject);
        }

    }

})(window, window.angular);