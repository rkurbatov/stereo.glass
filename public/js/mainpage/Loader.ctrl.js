function LoaderCtrl(sgPreloader) {
    var vm = this;
    vm.isLoading = true;
    vm.isSuccessful = false;
    vm.percentLoaded = 0;
    var urlPrefix = '/img/rooms/', urlPostfix = '';

    vm.bkImgs = {
        'cinema-15-8': {src: urlPrefix + 'cinema-15-8.jpg' + urlPostfix},
        'cinema-15-10': {src: urlPrefix + 'cinema-15-10.jpg' + urlPostfix},
        'livingroom-15-8': {src: urlPrefix + 'livingroom-15-8.png' + urlPostfix},
        'livingroom-15-10': {src: urlPrefix + 'livingroom-15-10.png' + urlPostfix},
        'kitchen-15-8': {src: urlPrefix + 'kitchen-15-8.png' + urlPostfix},
        'kitchen-15-10': {src: urlPrefix + 'kitchen-15-10.png' + urlPostfix},
        'childroom-15-8': {src: urlPrefix + 'childroom-15-8.png' + urlPostfix},
        'childroom-15-10': {src: urlPrefix + 'childroom-15-10.png' + urlPostfix},
        'club-15-8': {src: urlPrefix + 'club-15-8.png' + urlPostfix},
        'club-15-10': {src: urlPrefix + 'club-15-10.png' + urlPostfix},
        'bathroom-15-8': {src: urlPrefix + 'bathroom-15-8.png' + urlPostfix},
        'bathroom-15-10': {src: urlPrefix + 'bathroom-15-10.png' + urlPostfix},
        'caffee-15-8': {src: urlPrefix + 'caffee-15-8.png' + urlPostfix},
        'caffee-15-10': {src: urlPrefix + 'caffee-15-10.png' + urlPostfix}
    };

    vm.getBkSrc = function(name, isWideScreen) {
        if (isWideScreen) {
            return vm.bkImgs[name + '-15-8'].src
        } else {
            return vm.bkImgs[name + '-15-10'].src
        }
    };

    // Preload the images; then, update display when returned.
    sgPreloader.preloadImages(vm.bkImgs).then(
        function handleResolve(imageLocations) {
            // Loading was successful.
            vm.isLoading = false;
            vm.isSuccessful = true;
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