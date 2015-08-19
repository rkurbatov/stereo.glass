(function (window, angular, undefined) {
    'use strict';

    angular
        .module('MainPage')
        .service('auxData', auxData);

    auxData.$inject = [];

    function auxData() {

        // ==== DECLARATION ====
        var svc = this;

        /** @namespace window.isMobile */
        svc.settings = {
            currentPage: 'index',
            isWideScreen: undefined,
            screenIndex: 0,
            screenSections: [],
            isMobile: window.isMobile,
            handleScrollEvents: true
        };

        svc.loader = {
            isLoading: true,
            isSuccessful: false,
            percentLoaded: 0
        };

        var urlBkPrefix = '/img/rooms/', urlBkPostfix = '',
            url2dPrefix = '/img/2d-rooms/', url2dPostfix = '',
            url3dPrefix = '/img/3d-rooms/', url3dPostfix = '';

        svc.initialImgs = {
            'background': {src: '/img/background.gif'},
            'logo': {src: '/img/logo1000.png'}
        };

        svc.bkImgs = {
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
            'pavilion': {src: url2dPrefix + 'pavilion-v2-2d.gif' + url2dPostfix},
            'water': {src: url2dPrefix + 'water-2d.gif' + url2dPostfix},
            'aqua': {src: url2dPrefix + 'aqua-2d.gif' + url2dPostfix},
            'smoke': {src: url2dPrefix + 'smoke-2d.gif' + url2dPostfix},
            'tray': {src: url2dPrefix + 'agat-2d.gif' + url2dPostfix},
            'tableft': {src: url2dPrefix + 'coffee-2d.gif' + url2dPostfix},
            'tabmid': {src: url2dPrefix + 'citrus-2d.gif' + url2dPostfix},
            'tabright': {src: url2dPrefix + 'strawberry-2d.gif' + url2dPostfix},
            'advert': {src: url2dPrefix + 'beeline-2d.gif' + url2dPostfix}
        };

        svc.animImgs = {
            'buddha': {src: url3dPrefix + 'buddha-3d.gif' + url3dPostfix},
            'clock': {src: url3dPrefix + 'clock-3d.gif' + url3dPostfix},
            'grass': {src: url2dPrefix + 'grass-2d.gif' + url3dPostfix},
            'grass-fl1': {src: url3dPrefix + 'grass-flowers1-3d.gif' + url3dPostfix},
            'grass-fl2': {src: url3dPrefix + 'grass-flowers2-3d.gif' + url3dPostfix},
            'kitchen-wl1': {src: url3dPrefix + 'kitchen-wall1-3d.gif' + url3dPostfix},
            'kitchen-wl2': {src: url3dPrefix + 'kitchen-wall2-3d.gif' + url3dPostfix},
            'kitchen-wl3': {src: url3dPrefix + 'kitchen-wall3-3d.gif' + url3dPostfix},
            'teddybear': {src: url3dPrefix + 'teddybear-3d.gif' + url3dPostfix},
            'teddycat': {src: url3dPrefix + 'teddycat-3d.gif' + url3dPostfix},
            'teddyhare': {src: url3dPrefix + 'teddyhare-3d.gif' + url3dPostfix},
            'pavilion': {src: url3dPrefix + 'pavilion-v2-3d.gif' + url3dPostfix},
            'water': {src: url3dPrefix + 'water-3d.gif' + url3dPostfix},
            'aqua': {src: url3dPrefix + 'aqua-3d.gif' + url3dPostfix},
            'smoke': {src: url3dPrefix + 'smoke-3d.gif' + url3dPostfix},
            'tray': {src: url3dPrefix + 'agat-3d.gif' + url3dPostfix},
            'tableft': {src: url3dPrefix + 'coffee-3d.gif' + url3dPostfix},
            'tabmid': {src: url3dPrefix + 'citrus-3d.gif' + url3dPostfix},
            'tabright': {src: url3dPrefix + 'strawberry-3d.gif' + url3dPostfix},
            'advert': {src: url3dPrefix + 'beeline-3d.gif' + url3dPostfix}
        };

        svc.coordsWideScreen = {
            clock: [[817, 115], [973, 103], [973, 263], [817, 262]],
            buddha: [[-2, 77], [338, 125], [338, 383], [-2, 426]],
            kitchen1: [[520, 298], [589, 297], [589, 397], [520, 398]],
            kitchen2: [[718, 296], [789, 295], [789, 395], [718, 396]],
            kitchen3: [[895, 296], [964, 295], [964, 395], [895, 396]],
            kitchenfloor: [[-64, 629], [1012, 568], [2048, 839], [-522, 1039]],
            teddybear: [[364, 123], [590, 140], [590, 550], [364, 624]],
            teddyhare: [[1080, 279], [1140, 280], [1140, 369], [1080, 366]],
            teddycat: [[1140, 280], [1153, 274], [1153, 361], [1140, 369]],
            pavilion: [[35, -135], [676, -10], [676, 417], [35, 513]],
            mirror: [[999, 55], [550, -10], [503, 342], [999, 450]],
            bathfloor: [[-72, 800], [764, 542], [1470, 880], [392, 1792]],
            clubfloor: [[275, 600], [1219, 600], [1920, 1000], [-410, 1000]],
            aqualeft: [[-100, 0], [400, 0], [400, 330], [-100, 330]],
            aquaright: [[1180, 0], [1680, 0], [1680, 330], [1180, 330]],
            tray: [[159, 449], [277, 440], [277, 580], [159, 603]],
            tableft: [[546, 185], [379, 170], [379, 343], [546, 345]],
            tabright: [[721, 201], [851, 210], [851, 345], [721, 344]],
            tabmid: [[558, 186], [709, 199], [709, 346], [558, 344]],
            advert: [[1051, 200], [1232, 139], [1232, 392], [1051, 389]]
        };

        svc.coordsNarrowScreen = {
            clock: [[817, 148], [973, 136], [973, 296], [817, 295]],
            buddha: [[-2, 110], [338, 158], [338, 416], [-2, 459]],
            kitchen1: [[520, 433], [589, 432], [589, 532], [520, 533]],
            kitchen2: [[718, 431], [789, 430], [789, 530], [718, 531]],
            kitchen3: [[895, 431], [964, 430], [964, 530], [895, 531]],
            kitchenfloor: [[-64, 764], [1012, 703], [2048, 974], [-522, 1174]],
            teddybear: [[364, 253], [590, 270], [590, 680], [364, 754]],
            teddyhare: [[1080, 309], [1140, 410], [1140, 499], [1080, 496]],
            teddycat: [[1140, 410], [1153, 404], [1153, 491], [1140, 499]],
            pavilion: [[35, 75], [676, 200], [676, 627], [35, 723]],
            mirror: [[999, 265], [550, 200], [503, 552], [999, 660]],
            bathfloor: [[-72, 1010], [764, 752], [1470, 1090], [392, 2002]],
            clubfloor: [[275, 750], [1219, 750], [1920, 1150], [-410, 1150]],
            aqualeft: [[-100, 150], [400, 150], [400, 480], [-100, 480]],
            aquaright: [[1180, 150], [1680, 150], [1680, 480], [1180, 480]],
            tray: [[159, 589], [277, 580], [277, 720], [159, 743]],
            tableft: [[546, 325], [379, 310], [379, 483], [546, 485]],
            tabright: [[721, 341], [851, 350], [851, 485], [721, 484]],
            tabmid: [[558, 326], [709, 339], [709, 486], [558, 484]],
            advert: [[1051, 340], [1232, 279], [1232, 532], [1051, 529]]
        };

    }

})(window, window.angular);