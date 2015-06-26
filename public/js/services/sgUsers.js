(function(){
    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgUsers', sgUsers);

    sgUsers.$inject = ['$http', '$q', '$cookies'];

    function sgUsers($http, $q, $cookies) {

        var svc = this;

        svc.currentUser = {
            name : $cookies.get('username'),
            mail : $cookies.get('usermail'),
            role : $cookies.get('userrole')
        };

        console.log(svc.currentUser);

        svc.getLayoutAuthors = getLayoutAuthors;
        svc.getRaters = getRaters;
        svc.getListOfUsers = getListOfUsers;

        function getLayoutAuthors() {
            return $http.get('/api/authors')
                .then(function (response) {
                    return $q.resolve(_.pluck(response.data, '_id'));
                });
        }

        function getRaters() {
            return getListOfUsers(['admin', 'founder']).then(function(raters){
               return _.without(_.pluck(raters, 'username'), 'Roman Kurbatov');
            });
        }

        function getListOfUsers(roles) {
            return $http.get('/api/users', {
                params: { roles: roles || [] }
            }).then(function (response) {
                return response.data;
            });
        }

    }

})();