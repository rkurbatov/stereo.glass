(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAuth')
        .controller('AuthCtrl', AuthCtrl)
        .controller('ResetCtrl', ResetCtrl);

    AuthCtrl.$inject = ['AuthSvc'];
    ResetCtrl.$inject=['ResetSvc', '$http', '$routeParams'];

    function AuthCtrl(AuthSvc) {
        AuthSvc.modalSignInRegister('static');
    }

    function ResetCtrl(ResetSvc, $http, $routeParams) {
        var token = $routeParams.id;
        $http.get('/auth/check-token/' + token)
            .then(function(){
                return ResetSvc
                    .modalResetPassword(token)
                    .then(function(result){

                    });
            })
            .catch(function(){
                ResetSvc
                    .modalBadToken();
            });

    }

})(window, window.angular);
