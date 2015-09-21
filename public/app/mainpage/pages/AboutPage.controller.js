(function (window, angular, videojs, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('AboutPage', AboutPage);

    AboutPage.$inject = ['auxData'];
    function AboutPage(auxData) {
        var vm = this;

        vm.isSelected = isSelected;
        vm.isSideSelected = isSideSelected;

        initController();

        // IMPLEMENTATION

        function initController() {

            // Initializing video.js for every video
            if (auxData.settings.currentSection === 'video'
                && auxData.settings.currentSubsection) {

                let initObject = {
                    controls: true,
                    preload: 'metadata'
                };
                let videoElm = angular.element('#' + auxData.settings.currentSubsection)[0];

                videojs(videoElm, initObject);
            }
        }

        function isSelected(str) {
            return auxData.settings.currentSection === str
                ? "selected"
                : "";
        }

        function isSideSelected(str) {
            return auxData.settings.currentSubsection === str
                ? "selected"
                : "";
        }

    }

})(window, window.angular, window.videojs);
