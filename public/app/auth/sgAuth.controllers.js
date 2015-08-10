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
            .then(function(result){
                console.log('result is: ', result);
                ResetSvc
                    .modalResetPassword();
            })
            .catch(function(err){
                console.log('err is: ', err);
                ResetSvc
                    .modalBadToken();
            });

    }

})(window, window.angular);
