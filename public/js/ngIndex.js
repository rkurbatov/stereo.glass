angular.module('SGApp', ['sg.ui'])
    .config(function (sgPlate3dOptionsProvider) {
        sgPlate3dOptionsProvider.setCustomEvent('carousel:resize');
    })
    .controller('LayoutCtrl', ['sgPreloader', '$timeout', LayoutCtrl])
    .controller('SGMainCtrl', ['$scope', SGMainCtrl])
    .directive('sgVideoOverlay', sgVideoOverlay)
    .directive('sgWideScreen', ['$window', '$parse', sgWideScreen])
    .directive('sgAltSrc', [sgAltSrc])
    .directive('sgCenterVertical', ['$window', sgCenterVertical]);

function SGMainCtrl($scope) {
    'use strict';

    var vm = this;

    var coordsWideScreen = {
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

    var coordsNarrowScreen = {
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

    // switch coords for 15:8 / 15:10 ratio
    $scope.$watch(function () {
            return vm.isWideScreen;
        },
        function (newVal) {
            if (newVal) {
                vm.coords = coordsWideScreen;
            } else {
                vm.coords = coordsNarrowScreen;
            }
        });
}