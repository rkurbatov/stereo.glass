(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('AboutPage', AboutPage);

    AboutPage.$inject = ['auxData'];
    function AboutPage(auxData) {
        var vm = this;

        vm.isSelected = isSelected;

        initController();

        // IMPLEMENTATION

        function initController() {

        }

        function isSelected(str) {
            return auxData.settings.currentSection === str
                ? "selected"
                : "";
        }

    }

})(window, window.angular);
