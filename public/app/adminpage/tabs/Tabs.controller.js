;
(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Tabs', Tabs);

    Tabs.$inject = ['sgLayouts', 'sgMessages', 'sgINTSvc'];

    function Tabs(sgLayouts, sgMessages, sgINTSvc) {
        var vm = this;

        vm.layouts = sgLayouts;
        vm.messages = sgMessages;

    }

})(window, window.angular);