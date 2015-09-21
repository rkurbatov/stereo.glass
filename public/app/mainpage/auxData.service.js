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
            currentPage: 'carousel',
            isWideScreen: undefined,
            screenIndex: 0,
            screenSections: [],
            isMobile: window.isMobile,
            handleScrollEvents: false
        };

        svc.loader = {
            isLoading: true,
            isSuccessful: false,
            percentLoaded: 0
        };

        var urlBkPrefix = svc.settings.isMobile.any
            ? '/img/m-rooms/'
            : '/img/d-rooms/';

        var urlBkPostfix = '',
            url2dPostfix = '',
            url3dPostfix = '';

        var url2dPrefix = svc.settings.isMobile.any
            ? '/img/m-static/'
            : '/img/d-static/';
        var url3dPrefix = svc.settings.isMobile.any
            ? '/img/m-anim/'
            : '/img/d-anim/';

        svc.initialImgs = {
            'background': {src: '/img/background.jpg'},
            'logo': {src: '/img/logo1000.png'},
            'logobw': {src: '/img/logo1000bw.png'}
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
            'buddha': {src: url2dPrefix + 'buddha-2d.jpg' + url2dPostfix},
            'clock': {src: url2dPrefix + 'clock-2d.jpg' + url2dPostfix},
            'grass': {src: url2dPrefix + 'grass-2d.jpg' + url2dPostfix},
            'grass-flowers': {src: url2dPrefix + 'grass-flowers-2d.jpg' + url2dPostfix},
            'kitchen-wl1': {src: url2dPrefix + 'kitchen-wall1-2d.gif' + url2dPostfix},
            'kitchen-wl2': {src: url2dPrefix + 'kitchen-wall2-2d.gif' + url2dPostfix},
            'kitchen-wl3': {src: url2dPrefix + 'kitchen-wall3-2d.gif' + url2dPostfix},
            'teddybear': {src: url2dPrefix + 'teddybear-2d.gif' + url2dPostfix},
            'teddycat': {src: url2dPrefix + 'teddycat-2d.gif' + url2dPostfix},
            'teddyhare': {src: url2dPrefix + 'teddyhare-2d.gif' + url2dPostfix},
            'pavilion': {src: url2dPrefix + 'pavilion-2d.jpg' + url2dPostfix},
            'water': {src: url2dPrefix + 'water-2d.jpg' + url2dPostfix},
            'aqua': {src: url2dPrefix + 'aqua-2d.jpg' + url2dPostfix},
            'smoke': {src: url2dPrefix + 'smoke-2d.jpg' + url2dPostfix},
            'tray': {src: url2dPrefix + 'agat-2d.gif' + url2dPostfix},
            'tableft': {src: url2dPrefix + 'coffee-2d.gif' + url2dPostfix},
            'tabmid': {src: url2dPrefix + 'citrus-2d.gif' + url2dPostfix},
            'tabright': {src: url2dPrefix + 'strawberry-2d.gif' + url2dPostfix},
            'advert': {src: url2dPrefix + 'beeline-2d.gif' + url2dPostfix}
        };

        svc.animImgs = {
            'buddha': {src: url3dPrefix + 'buddha-3d.gif' + url3dPostfix},
            'clock': {src: url3dPrefix + 'clock-3d.gif' + url3dPostfix},
            'grass': {src: url2dPrefix + 'grass-2d.jpg' + url3dPostfix},
            'grass-flowers': {src: url3dPrefix + 'grass-flowers-3d.gif' + url3dPostfix},
            'kitchen-wl1': {src: url3dPrefix + 'kitchen-wall1-3d.gif' + url3dPostfix},
            'kitchen-wl2': {src: url3dPrefix + 'kitchen-wall2-3d.gif' + url3dPostfix},
            'kitchen-wl3': {src: url3dPrefix + 'kitchen-wall3-3d.gif' + url3dPostfix},
            'teddybear': {src: url3dPrefix + 'teddybear-3d.gif' + url3dPostfix},
            'teddycat': {src: url3dPrefix + 'teddycat-3d.gif' + url3dPostfix},
            'teddyhare': {src: url3dPrefix + 'teddyhare-3d.gif' + url3dPostfix},
            'pavilion': {src: url3dPrefix + 'pavilion-3d.gif' + url3dPostfix},
            'water': {src: url3dPrefix + 'water-3d.gif' + url3dPostfix},
            'aqua': {src: url3dPrefix + 'aqua-3d.gif' + url3dPostfix},
            'smoke': {src: url3dPrefix + 'smoke-3d.gif' + url3dPostfix},
            'tray': {src: url3dPrefix + 'agat-3d.gif' + url3dPostfix},
            'tableft': {src: url3dPrefix + 'coffee-3d.gif' + url3dPostfix},
            'tabmid': {src: url3dPrefix + 'citrus-3d.gif' + url3dPostfix},
            'tabright': {src: url3dPrefix + 'strawberry-3d.gif' + url3dPostfix},
            'advert': {src: url3dPrefix + 'beeline-3d.gif' + url3dPostfix}
        };

        svc.coordsWideScreenDesktop = {
            clock: [[817, 115], [973, 103], [973, 263], [817, 262]],
            buddha: [[-2, 76], [338, 124], [338, 382], [-2, 426]],
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

        svc.coordsWideScreenMobile = {
            clock: [[409, 57], [487, 52], [487, 132], [409, 131]],
            buddha: [[-1, 39], [169, 63], [169, 191], [-1, 213]],
            kitchen1: [[260, 149], [294, 148], [294, 194], [260, 194]],
            kitchen2: [[359, 148], [394, 148], [394, 197], [359, 198]],
            kitchen3: [[447, 148], [482, 148], [482, 198], [447, 198]],
            kitchenfloor: [[-32, 314], [506, 284], [1024, 420], [-261, 520]],
            teddybear: [[182, 62], [295, 70], [295, 275], [182, 312]],
            teddyhare: [[540, 140], [570, 140], [570, 185], [540, 183]],
            teddycat: [[570, 140], [576, 137], [577, 181], [570, 184]],
            pavilion: [[17, -67], [338, -5], [338, 209], [17, 257]],
            mirror: [[500, 28], [275, -5], [251, 171], [500, 225]],
            bathfloor: [[-36, 400], [382, 271], [735, 440], [196, 896]],
            clubfloor: [[137, 300], [609, 300], [910, 500], [-205, 500]],
            aqualeft: [[-50, 0], [200, 0], [200, 165], [-50, 165]],
            aquaright: [[590, 0], [840, 0], [840, 165], [590, 165]],
            tray: [[79, 225], [138, 220], [138, 290], [80, 302]],
            tableft: [[273, 93], [184, 85], [190, 171], [273, 172]],
            tabright: [[360, 100], [426, 105], [426, 172], [361, 172]],
            tabmid: [[279, 93], [355, 99], [354, 173], [279, 172]],
            advert: [[526, 100], [616, 70], [616, 196], [526, 194]]
        };

        svc.coordsNarrowScreenDesktop = {
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
            aqualeft: [[-100, 110], [400, 110], [400, 480], [-100, 480]],
            aquaright: [[1180, 110], [1680, 110], [1680, 480], [1180, 480]],
            tray: [[159, 589], [277, 580], [277, 720], [159, 743]],
            tableft: [[546, 325], [379, 310], [379, 483], [546, 485]],
            tabright: [[721, 341], [851, 350], [851, 485], [721, 484]],
            tabmid: [[558, 326], [709, 339], [709, 486], [558, 484]],
            advert: [[1051, 340], [1232, 279], [1232, 532], [1051, 529]]
        };

        svc.coordsNarrowScreenMobile = {
            clock: [[409, 74], [487, 68], [487, 148], [409, 148]],
            buddha: [[-1, 55], [169, 79], [169, 208], [-1, 230]],
            kitchen1: [[260, 216], [295, 216], [294, 266], [260, 266]],
            kitchen2: [[359, 216], [394, 215], [394, 265], [359, 266]],
            kitchen3: [[448, 216], [482, 215], [482, 265], [448, 266]],
            kitchenfloor: [[-32, 382], [506, 352], [1024, 487], [-261, 587]],
            teddybear: [[182, 126], [295, 135], [295, 340], [182, 377]],
            teddyhare: [[540, 154], [570, 205], [570, 250], [540, 248]],
            teddycat: [[570, 205], [576, 202], [576, 246], [570, 255]],
            pavilion: [[18, 37], [338, 100], [338, 314], [17, 362]],
            mirror: [[500, 132], [225, 100], [252, 276], [500, 330]],
            bathfloor: [[-36, 505], [382, 376], [735, 545], [196, 1001]],
            clubfloor: [[137, 375], [609, 375], [960, 575], [-205, 575]],
            aqualeft: [[-50, 55], [200, 55], [200, 240], [-50, 240]],
            aquaright: [[590, 55], [840, 55], [840, 240], [590, 240]],
            tray: [[79, 295], [139, 290], [139, 360], [79, 372]],
            tableft: [[273, 162], [190, 155], [190, 241], [273, 242]],
            tabright: [[361, 171], [426, 175], [426, 242], [360, 242]],
            tabmid: [[279, 163], [354, 169], [354, 243], [279, 242]],
            advert: [[526, 170], [616, 139], [616, 266], [526, 264]]
        };

        svc.coordsNarrowScreen = svc.settings.isMobile.any
            ? svc.coordsNarrowScreenMobile
            : svc.coordsNarrowScreenDesktop;

        svc.coordsWideScreen = svc.settings.isMobile.any
            ? svc.coordsWideScreenMobile
            : svc.coordsWideScreenDesktop;

    }

})(window, window.angular);