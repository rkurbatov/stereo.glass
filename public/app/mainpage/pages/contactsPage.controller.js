(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('ContactsPage', ContactsPage);

    ContactsPage.$inject = ['auxData'];
    function ContactsPage(auxData) {
        var vm = this;

        initController();

        // IMPLEMENTATION

        function initController() {
            auxData.settings.currentPage = 'contacts';
        }

    }

})(window, window.angular);
