(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('MainPage', MainPage);

    MainPage.$inject = ['sgPreloader', '$timeout', 'auxData', 'Users'];
    function MainPage(sgPreloader, $timeout, auxData, Users) {
        var vm = this;
        vm.settings = auxData.settings;
        vm.loader = {
            isLoading: true,
            isSuccessful: false,
            percentLoaded: 0
        };

        vm.currentUser = Users.currentUser;

        vm.getBkSrc = getBkSrc;
        vm.switchPage = switchPage;
        vm.signIn = signIn;

        initController();

        // IMPLEMENTATION

        function initController() {
            // Preload the images; then, update display when returned.
            sgPreloader.preloadImages(auxData.bkImgs).then(
                function handleResolve(imageLocations) {
                    // Loading was successful.
                    vm.loader.isLoading = false;
                    vm.loader.isSuccessful = true;
                    $timeout(function () {
                        sgPreloader.preloadImages(auxData.animImgs);
                    }, 250);
                },
                function handleReject(imageLocation) {
                    // Loading failed on at least one image.
                    vm.loader.isLoading = false;
                    vm.loader.isSuccessful = false;
                    console.error("Image Failed", imageLocation);
                    console.info("Preload Failure");
                },
                function handleNotify(event) {
                    vm.loader.percentLoaded = event.percent;
                    //console.info("Percent loaded:", event.percent);
                }
            );
        }

        function getBkSrc(name) {
            if (auxData.settings.isWideScreen) {
                return auxData.bkImgs[name + '-15-8'].src
            } else {
                return auxData.bkImgs[name + '-15-10'].src
            }
        }

        function switchPage(pageName) {
            if (vm.settings.currentPage === pageName) {
                return
            }

            switch (pageName) {
                case "main":
                case "about":
                case "goods":
                //TODO: animated menu of goods
                case "dealers":
                case "contacts":

            }
            vm.settings.currentPage = pageName;
        }

        function signIn() {

        }

    }

})(window, window.angular);
