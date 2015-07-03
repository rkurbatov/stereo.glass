(function(){
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Messages', Messages);

    Messages.$inject = ['sgMessages'];

    function Messages(sgMessages){

    }

})();