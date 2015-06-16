function LoaderCtrl(sgPreloader, $timeout) {
    var vm = this;
    vm.isLoading = true;
    vm.isSuccessful = false;
    vm.percentLoaded = 0;
    var urlBkPrefix = '/img/rooms/', urlBkPostfix = '',
        url2dPrefix = '/img/2d-rooms/', url2dPostfix = '',
        url3dPrefix = '/img/3d-rooms/', url3dPostfix = '';

    vm.bkImgs = {
        'cinema-15-8': {src: urlBkPrefix + 'cinema-15-8.jpg' + urlBkPostfix},
        'cinema-15-10': {src: urlBkPrefix + 'cinema-15-10.jpg' + urlBkPostfix},
        'livingroom-15-8': {src: urlBkPrefix + 'livingroom-15-8.png' + urlBkPostfix},
        'livingroom-15-10': {src: urlBkPrefix + 'livingroom-15-10.png' + urlBkPostfix},
        'kitchen-15-8': {src: urlBkPrefix + 'kitchen-15-8.png' + urlBkPostfix},
        'kitchen-15-10': {src: urlBkPrefix + 'kitchen-15-10.png' + urlBkPostfix},
        'childroom-15-8': {src: urlBkPrefix + 'childroom-15-8.png' + urlBkPostfix},
        'childroom-15-10': {src: urlBkPrefix + 'childroom-15-10.png' + urlBkPostfix},
        'club-15-8': {src: urlBkPrefix + 'club-15-8.png' + urlBkPostfix},
        'club-15-10': {src: urlBkPrefix + 'club-15-10.png' + urlBkPostfix},
        'bathroom-15-8': {src: urlBkPrefix + 'bathroom-15-8.png' + urlBkPostfix},
        'bathroom-15-10': {src: urlBkPrefix + 'bathroom-15-10.png' + urlBkPostfix},
        'caffee-15-8': {src: urlBkPrefix + 'caffee-15-8.png' + urlBkPostfix},
        'caffee-15-10': {src: urlBkPrefix + 'caffee-15-10.png' + urlBkPostfix},
        'buddha': {src: url2dPrefix + 'buddha-2d.gif' + url2dPostfix},
        'clock': {src: url2dPrefix + 'clock-2d.gif' + url2dPostfix},
        'grass': {src: url2dPrefix + 'grass-2d.gif' + url2dPostfix},
        'grass-fl1': {src: url2dPrefix + 'grass-flowers1-2d.gif' + url2dPostfix},
        'grass-fl2': {src: url2dPrefix + 'grass-flowers2-2d.gif' + url2dPostfix},
        'kitchen-wl1': {src: url2dPrefix + 'kitchen-wall1-2d.gif' + url2dPostfix},
        'kitchen-wl2': {src: url2dPrefix + 'kitchen-wall2-2d.gif' + url2dPostfix},
        'kitchen-wl3': {src: url2dPrefix + 'kitchen-wall3-2d.gif' + url2dPostfix},
        'teddybear': {src: url2dPrefix + 'teddybear-2d.gif' + url2dPostfix},
        'teddycat': {src: url2dPrefix + 'teddycat-2d.gif' + url2dPostfix},
        'teddyhare': {src: url2dPrefix + 'teddyhare-2d.gif' + url2dPostfix},
        'pavilion': {src: url2dPrefix + 'pavilion-2d.gif' + url2dPostfix},
        'water': {src: url2dPrefix + 'water-2d.gif' + url2dPostfix},
        'aqua': {src: url2dPrefix + 'aqua-2d.gif' + url2dPostfix},
        'smoke': {src: url2dPrefix + 'smoke-2d.gif' + url2dPostfix},
        'tray': {src: url2dPrefix + 'agat-2d.gif' + url2dPostfix},
        'tableft': {src: url2dPrefix + 'coffee-2d.gif' + url2dPostfix},
        'tabmid': {src: url2dPrefix + 'citrus-2d.gif' + url2dPostfix},
        'tabright': {src: url2dPrefix + 'strawberry-2d.gif' + url2dPostfix},
        'advert': {src: url2dPrefix + 'beeline-2d.gif' + url2dPostfix}
    };

    vm.animImgs = {
       'buddha' : {src: url3dPrefix + 'buddha-3d.gif' + url3dPostfix },
       'clock' : {src: url3dPrefix + 'clock-3d.gif' + url3dPostfix },
       'grass' : {src: url2dPrefix + 'grass-2d.gif' + url3dPostfix },
       'grass-fl1' : {src: url3dPrefix + 'grass-flowers1-3d.gif' + url3dPostfix },
       'grass-fl2' : {src: url3dPrefix + 'grass-flowers2-3d.gif' + url3dPostfix },
       'kitchen-wl1' : {src: url3dPrefix + 'kitchen-wall1-3d.gif' + url3dPostfix },
       'kitchen-wl2' : {src: url3dPrefix + 'kitchen-wall2-3d.gif' + url3dPostfix },
       'kitchen-wl3' : {src: url3dPrefix + 'kitchen-wall3-3d.gif' + url3dPostfix },
       'teddybear' : {src: url3dPrefix + 'teddybear-3d.gif' + url3dPostfix },
       'teddycat' : {src: url3dPrefix + 'teddycat-3d.gif' + url3dPostfix },
       'teddyhare' : {src: url3dPrefix + 'teddyhare-3d.gif' + url3dPostfix },
       'pavilion' : {src: url3dPrefix + 'pavilion-3d.gif' + url3dPostfix },
       'water' : {src: url3dPrefix + 'water-3d.gif' + url3dPostfix },
       'aqua' : {src: url3dPrefix + 'aqua-3d.gif' + url3dPostfix },
       'smoke' : {src: url3dPrefix + 'smoke-3d.gif' + url3dPostfix },
       'tray' : {src: url3dPrefix + 'agat-3d.gif' + url3dPostfix },
       'tableft' : {src: url3dPrefix + 'coffee-3d.gif' + url3dPostfix },
       'tabmid' : {src: url3dPrefix + 'citrus-3d.gif' + url3dPostfix },
       'tabright' : {src: url3dPrefix + 'strawberry-3d.gif' + url3dPostfix },
       'advert' : {src: url3dPrefix + 'beeline-3d.gif' + url3dPostfix}
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
            $timeout(function() {
                sgPreloader.preloadImages(vm.animImgs);
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