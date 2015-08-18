(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .controller('HeaderCtrl', Header);

    Header.$inject = ['sgPreloader', '$timeout', 'AuthSvc', 'auxData'];
    function Header(sgPreloader, $timeout, AuthSvc, auxData) {

        var vm = this;
        vm.loader = auxData.loader;

        vm.signInRegister = signInRegister;
        vm.currentUser = AuthSvc.currentUser;
        vm.settings = auxData.settings;


        initController();

        // IMPLEMENTATION

        function initController() {
            // Preload the images; then, update display when returned.
            sgPreloader
                .preloadImages(auxData.bkImgs)
                .then(
                function handleResolve() {
                    // Loading was successful.
                    vm.loader.isLoading = false;
                    vm.loader.isSuccessful = true;
                    vm.settings.isLoaded = true;
                    console.log('loaded static');
                    sgPreloader.
                        preloadImages(auxData.animImgs)
                        .then(()=>console.log('loaded animated'));
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

        function signInRegister() {
            vm.settings.handleScrollEvents = false;
            AuthSvc
                .modalSignInRegister()
                .then(()=> {
                    vm.settings.handleScrollEvents = true;
                })
                .catch(()=> {
                    vm.settings.handleScrollEvents = true;
                });
        }

    }

})(window, window.angular);
