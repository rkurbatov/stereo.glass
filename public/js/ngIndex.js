angular.module('SGApp', ['sg.ui'])
    .config(function (sgPlate3dOptionsProvider) {

    })
    .controller('LoaderCtrl', ['sgPreloader', LoaderCtrl])
    .controller('SGMainCtrl', ['$scope', SGMainCtrl])
    .directive('sgVideoOverlay', sgVideoOverlay)
    .directive('sgWideScreen', ['$window', '$parse', sgWideScreen]);

function SGMainCtrl() {
    'use strict';

    var vm = this;
    vm.coords = {
        clock: [[817, 115], [973, 103], [973, 263], [817, 262]],
        buddah: [[-2, 77], [338, 125], [338, 383], [-2, 426]],
        kitchen1: [[520, 298], [589, 297], [589, 397], [520, 398]],
        kitchen2: [[720, 296], [789, 295], [789, 395], [720, 396]],
        kitchen3: [[895, 296], [964, 295], [964, 395], [895, 396]],
        kitchenfloor: [[-64, 629], [1012, 568], [2048, 839], [-522, 1039]],
        teddybear: [[364, 123], [590, 140], [590, 550], [364, 624]],
        teddyhare: [[1080, 279], [1140, 280], [1140, 369], [1080, 366]],
        teddycat: [[1140, 280], [1153, 274], [1153, 361], [1140, 369]],
        pavilion: [[35, -5], [676, -10], [676, 417], [35, 513]],
        mirror: [[999, 55], [550, -10], [503, 342], [999, 450]],
        bathfloor: [[-72, 800], [764, 542], [1470, 880], [392, 1792]],
        clubfloor: [[275, 600], [1219, 600], [1920, 1000], [-410, 1000]],
        aqualeft: [[-100, 0], [400, 0], [400, 330], [-100, 330]],
        aquaright: [[1180, 0], [1680, 0], [1680, 330], [1180, 330]],
        tray: [[159, 449], [277, 440], [277, 580], [159, 603]],
        tableft: [[546, 185], [379, 170], [379, 343], [546, 345]],
        tabright: [[721, 201], [851, 210], [851, 345], [721, 344]],
        tabmid: [[558, 186], [709, 199], [709, 346], [558, 344]],
        advert: [[1051,200],[1232,139],[1232,392],[1051,389]]
    };
}