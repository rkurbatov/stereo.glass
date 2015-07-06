(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgMessages', sgMessages);

    sgMessages.$inject = ['$http'];

    function sgMessages($http) {
        var svc = this;

        // DECLARATION

        svc.create = create;
        svc.getList = getList;
        svc.unreadCount = 0;

        // IMPLEMENTATION

        function create(message) {
            var params = {};
            params.message = message;

            return $http.post('/api/messages', {params: params});

        }

        function getList(user, groups) {
            return $http.post('/api/messages/search' +
                '/user/' + encodeURIComponent(user) +
                '/groups/' + encodeURIComponent(groups))
                .then(function (response) {
                    svc.unreadCount = _.countBy(response.data, function(message) {
                        return message.readStatus === 'unread';
                    }).true || 0;
                    return response.data;
                });
        }

    }

})();
