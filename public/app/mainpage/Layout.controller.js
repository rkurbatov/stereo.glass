(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('Layout', Layout);

    Layout.$inject = ['sgPreloader', '$timeout', 'auxData', 'Users'];
    function Layout(sgPreloader, $timeout, auxData, Users) {
        var vm = this;
        vm.isLoading = true;
        vm.isSuccessful = false;
        vm.isMobile = window.isMobile;
        vm.currentPage = "main";
        vm.percentLoaded = 0;

        vm.currentUser = Users.currentUser;
        console.log(vm.currentUser);

        vm.getBkSrc = getBkSrc;
        vm.switchPage = switchPage;
        vm.signIn = Users.signIn;
        vm.signOut = Users.signOut;

        initController();

        // IMPLEMENTATION

        function initController() {
            // Preload the images; then, update display when returned.
            sgPreloader.preloadImages(auxData.bkImgs).then(
                function handleResolve(imageLocations) {
                    // Loading was successful.
                    vm.isLoading = false;
                    vm.isSuccessful = true;
                    $timeout(function () {
                        sgPreloader.preloadImages(auxData.animImgs);
                    }, 250);
                },
                function handleReject(imageLocation) {
                    // Loading failed on at least one image.
                    vm.isLoading = false;
                    vm.isSuccessful = false;
                    console.error("Image Failed", imageLocation);
                    console.info("Preload Failure");
                },
                function handleNotify(event) {
                    vm.percentLoaded = event.percent;
                    //console.info("Percent loaded:", event.percent);
                }
            );
        }

        function getBkSrc(name, isWideScreen) {
            if (isWideScreen) {
                return auxData.bkImgs[name + '-15-8'].src
            } else {
                return auxData.bkImgs[name + '-15-10'].src
            }
        }

        function switchPage(pageName) {
            if (vm.currentPage === pageName) {
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
            console.log('switching to page ', pageName);
            vm.currentPage = pageName;
        }

    }

})(window, window.angular);
