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

        svc.remove = remove;
        svc.update = update;
        svc.reload = reload;

        var allRoles = ['admin', 'curator', 'founder', 'designer', 'user'];

        initService();

        function initService() {
            reload();
        }

        function reload() {
            var usersPromise = $http.get('/api/users', {
                params: {roles: allRoles}
            }).then(function (response) {
                createFilteredList(svc.list = response.data);
            });

            var authorsPromise = $http.get('/api/users/authors')
                .then(function (response) {
                    svc.authors = _.pluck(response.data, '_id');
                });

            svc.loaded = $q.all([usersPromise, authorsPromise]);

            function createFilteredList(users) {
                svc.raters = _.pluck(_.filter(users, function (user) {
                    return _.contains(['admin', 'curator', 'founder'], user.role) && user.username !== 'Roman Kurbatov';
                }), 'username');

                svc.designers = _.pluck(_.filter(users, function (user) {
                    return user.role === 'designer';
                }), 'username');

            }
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

            return $http.put('/api/users/' + id, {params: params});
        }

    }

})();