;
(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Tabs', Tabs);

    Tabs.$inject = ['sgLayouts', 'sgMessages', 'sgIntSvc'];

    function Tabs(sgLayouts, sgMessages, sgIntSvc) {
        var vm = this;

        vm.layouts = sgLayouts;
        vm.messages = sgMessages;

    }

})(window, window.angular);