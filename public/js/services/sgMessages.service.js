(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgMessages', sgMessages);

    sgMessages.$inject = [];

    function sgMessages() {
        var svc = this;

        // DECLARATION

        svc.create = create;
        svc.getList = getList;

        // IMPLEMENTATION

        function create(message) {
            return $http.post('/api/messages', {params: message});

        }

        function getList(name, roles) {
            return $http.post('/api/messages/search' +
                '/name/' + encodeURIComponent(name) +
                '/roles/' + encodeURIComponent(roles))
                .then(function (response) {
                    console.log(response.data);
                    return response.data;
                });
        }

    }
})();