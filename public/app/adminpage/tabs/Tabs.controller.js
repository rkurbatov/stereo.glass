;
(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sgAppAdmin')
        .controller('Tabs', Tabs);

    Tabs.$inject = ['sgLayouts', 'sgMessages'];

    function Tabs(sgLayouts, sgMessages) {
        var vm = this;

        vm.layouts = sgLayouts;
        vm.messages = sgMessages;

    }

})(window, window.angular);