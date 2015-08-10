(function (window, angular, undefined) {
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
        svc.systemMail = '"Stereo.Glass" <mailer@stereoglass.com>';
        svc.eMail = eMail;

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
                    svc.unreadCount = _.countBy(response.data, function (message) {
                            return message.readStatus === 'unread';
                        }).true || 0;
                    return response.data;
                });
        }

        function eMail(mail, vars) {
            return $http.post('/api/mail/', {
                params: {
                    mail: mail,
                    vars: vars
                }
            });
        }

    }

})(window, window.angular);
