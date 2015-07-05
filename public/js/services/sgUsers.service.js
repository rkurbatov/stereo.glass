(function () {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgUsers', sgUsers);

    sgUsers.$inject = ['$http', '$q', '$cookies'];

    function sgUsers($http, $q, $cookies) {

        var svc = this;

        svc.currentUser = {
            name: $cookies.get('username'),
            mail: $cookies.get('usermail'),
            role: $cookies.get('userrole')
        };

        svc.getLayoutAuthors = getLayoutAuthors;
        svc.getListOfUsers = getListOfUsers;
        svc.getRaters = getRaters;
        svc.getDesigners = getDesigners;
        svc.remove = remove;
        svc.update = update;

        function getLayoutAuthors() {
            return $http.get('/api/users/authors')
                .then(function (response) {
                    return $q.resolve(_.pluck(response.data, '_id'));
                });
        }

        function getRaters() {
            return getListOfUsers(['admin', 'founder']).then(function (raters) {
                return _.without(_.pluck(raters, 'username'), 'Roman Kurbatov');
            });
        }

        function getDesigners() {
            return getListOfUsers(['designer']).then(function (designers) {
                return _.pluck(designers, 'username');
            });
        }

        function getListOfUsers(roles) {
            return $http.get('/api/users', {
                params: {roles: roles || []}
            }).then(function (response) {
                return response.data;
            });
        }

        function remove(id) {
            return $http.delete('/api/users/' + id);
        }

        function update(id, setObject) {
            if (!setObject) {
                return $q.reject();
            }

            var params = {
                setObject: setObject
            };

            return $http.put('/api/users/' + id, { params: params });
        }

    }

})();