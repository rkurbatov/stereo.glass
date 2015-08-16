(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('AboutPage', AboutPage);

    AboutPage.$inject = ['auxData'];
    function AboutPage(auxData) {
        var vm = this;

        initController();

        // IMPLEMENTATION

        function initController() {
            auxData.settings.currentPage = 'about';
        }

    }

})(window, window.angular);
