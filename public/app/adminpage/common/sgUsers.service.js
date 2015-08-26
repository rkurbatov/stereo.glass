(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgUsers', sgUsers);

    sgUsers.$inject = ['$http', '$q', '$cookies'];

    function sgUsers($http, $q, $cookies) {

        // ==== DECLARATION ====
        var svc = this;

        svc.currentUser = {
            name: $cookies.get('username'),
            mail: $cookies.get('usermail'),
            role: $cookies.get('userrole')
        };

        svc.allRoles = ['admin', 'curator', 'founder', 'designer', 'interpreter', 'visitor'];
        svc.getMail = getMail;

        svc.remove = remove;
        svc.update = update;
        svc.reload = reload;

        // List of all users
        svc.list = {};

        // Names of users of different groups
        svc.authors = [];
        svc.commenters = [];
        svc.raters = [];
        svc.assignees = [];

        // Hash of borderColors (userName => Color)
        svc.borderColors = {};

        // ==== IMPLEMENTATION ====
        initService();

        function initService() {
            reload();
        }

        function reload() {
            var usersPromise = $http
                .get('/api/users', {
                    params: {roles: svc.allRoles}
                })
                .then((response)=> createFilteredList(svc.list = response.data));

            var authorsPromise = $http
                .get('/api/users/authors')
                .then((response)=> svc.authors = _.map(response.data, '_id'));

            svc.loaded = $q.all([usersPromise, authorsPromise]);
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

        function getMail(userName) {
            return (_.find(svc.list, {username: userName}) || {}).usermail;
        }

        function createFilteredList(users) {

            svc.commenters = svc.raters = _.map(_.filter(users, function (user) {
                return _.contains(['admin', 'curator', 'founder', 'designer'], user.role)
                    && user.username !== 'Roman Kurbatov';
            }), 'username');

            svc.assignees = _.map(
                _.filter(users, (user)=> {
                        return user.role === 'designer'
                    },
                    'username'));

            // Fill border colors hash
            _.each(svc.list, (user)=> {
                if (_.contains(['admin', 'curator', 'founder', 'designer'], user.role)) {
                    svc.borderColors[user.username] = user.borderColor;
                }
            });
        }

    }

})(window, window.angular);