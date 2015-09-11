(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .directive('sgMiniatureGallery', sgMiniatureGallery);

    sgMiniatureGallery.$inject = [];

    function sgMiniatureGallery() {

        return {
            restrict: 'ACE',
            scope: {},
            controller,
            link
        };

        function controller() {
            this.imgSrcArray = [];
        }

        function link(scope, elm, attrs) {
        }


    }

})(window, window.angular);