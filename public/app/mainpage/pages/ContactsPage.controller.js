(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('ContactsPage', ContactsPage);

    ContactsPage.$inject = [];
    function ContactsPage() {
        var vm = this;

        vm.holidays = function (time) {
            return {
                title: 'blah',
                isOpen: false
            }
        };

        initController();

        // IMPLEMENTATION

        function initController() {

        }

    }

})(window, window.angular);
