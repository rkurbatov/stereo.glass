function sgPlate3dOptions(){
    this.options = {};

    this.$get = function(){
        return this.options;
    };

    this.setCustomEvent = function(evtName) {
        this.options.customEvent = evtName;
    };
}

function sgPlate3d($parse, $window, $timeout) {
    return {
        restrict: 'AC',
        link: function (scope, elm, attrs) {
            var bound = angular.element('#' + attrs.for)[0] || angular.element(attrs.for)[0];

            angular.element($window).on('load resize', plateRedraw);


            function plateRedraw() {
                var coords = $parse(attrs.coords)();

                var scaleX, scaleY;

                if (bound && bound.nodeName === 'IMG') {
                    scaleX = bound.clientWidth / bound.naturalWidth;
                    scaleY = bound.clientHeight / bound.naturalHeight;
                } else {
                    scaleX = 1;
                    scaleY = 1;
                }

                var elmWidth = $parse(attrs.width)() || elm[0].clientWidth;
                var elmHeight = $parse(attrs.height)() || elm[0].clientHeight;

                //console.log(coords.toString(), elmWidth, elmHeight, scaleX, scaleY);

                var matrix = get3dMatrix(coords, elmWidth, elmHeight, scaleX, scaleY);
                elm.css('transform', 'matrix3d(' + matrix + ')');
                elm.css('transform-origin', '0 0');
            }
        }
    }
}

/**
 * Creates CSS matrix3d for given array of corner coordinates
 * @param {Array} coordinates
 * @param {Number} width of object to fit
 * @param {Number} height of object to fit
 * @param {Number} scaleX of object to fit
 * @param {Number} scaleY of object to fit
 * @returns {Array}
 */
function get3dMatrix(coordinates, width, height, scaleX, scaleY) {
    'use strict';
    function _foreach2(x, s, k, f) {
        if (k === s.length - 1) return f(x);
        var i, n = s[k], ret = new Array(n);
        for (i = n - 1; i >= 0; --i) ret[i] = _foreach2(x[i], s, k + 1, f);
        return ret;
    }

    function _dim(x) {
        var ret = [];
        while (typeof x === "object") {
            ret.push(x.length);
            x = x[0];
        }
        return ret;
    }

    function dim(x) {
        var y, z;
        if (typeof x === "object") {
            y = x[0];
            if (typeof y === "object") {
                z = y[0];
                if (typeof z === "object") {
                    return _dim(x);
                }
                return [x.length, y.length];
            }
            return [x.length];
        }
        return [];
    }

    function cloneV(x) {
        var _n = x.length, i, ret = new Array(_n);
        for (i = _n - 1; i !== -1; --i) ret[i] = x[i];
        return ret;
    }

    function clone(x) {
        return typeof x !== "object" ? x : _foreach2(x, dim(x), 0, cloneV);
    }

    function LU(A, fast) {
        var abs = Math.abs;
        fast = fast || false;
        var i, j, k, absAjk, Akk, Ak, Pk, Ai,
            max,
            n = A.length, n1 = n - 1,
            P = new Array(n);
        if (!fast) A = clone(A);
        for (k = 0; k < n; ++k) {
            Pk = k;
            Ak = A[k];
            max = abs(Ak[k]);
            for (j = k + 1; j < n; ++j) {
                absAjk = abs(A[j][k]);
                if (max < absAjk) {
                    max = absAjk;
                    Pk = j;
                }
            }
            P[k] = Pk;
            if (Pk != k) {
                A[k] = A[Pk];
                A[Pk] = Ak;
                Ak = A[k];
            }
            Akk = Ak[k];
            for (i = k + 1; i < n; ++i) {
                A[i][k] /= Akk;
            }
            for (i = k + 1; i < n; ++i) {
                Ai = A[i];
                for (j = k + 1; j < n1; ++j) {
                    Ai[j] -= Ai[k] * Ak[j];
                    ++j;
                    Ai[j] -= Ai[k] * Ak[j];
                }
                if (j === n1) Ai[j] -= Ai[k] * Ak[j];
            }
        }
        return {LU: A, P: P};
    }

    function LUsolve(LUP, b) {
        var i, j,
            LU = LUP.LU,
            n = LU.length,
            x = clone(b),
            P = LUP.P,
            Pi, LUi, tmp;
        for (i = n - 1; i !== -1; --i) {
            x[i] = b[i];
        }
        for (i = 0; i < n; ++i) {
            Pi = P[i];
            if (P[i] !== i) {
                tmp = x[i];
                x[i] = x[Pi];
                x[Pi] = tmp;
            }
            LUi = LU[i];
            for (j = 0; j < i; ++j) {
                x[i] -= x[j] * LUi[j];
            }
        }
        for (i = n - 1; i >= 0; --i) {
            LUi = LU[i];
            for (j = i + 1; j < n; ++j) {
                x[i] -= x[j] * LUi[j];
            }
            x[i] /= LUi[i];
        }
        return x;
    }

    function solve(A, b, fast) {
        return LUsolve(LU(A, fast), b);
    }

    var a = [], b = [],
        sourcePoints = [[0, 0], [width, 0], [width, height], [0, height]],
        X, matrix;

    for (var i = 0, n = sourcePoints.length; i < n; ++i) {
        var s = sourcePoints[i], t = coordinates[i].slice(0);
        t[0] *= scaleX;
        t[1] *= scaleY;
        a.push([s[0], s[1], 1, 0, 0, 0, -s[0] * t[0], -s[1] * t[0]]);
        b.push(t[0]);
        a.push([0, 0, 0, s[0], s[1], 1, -s[0] * t[1], -s[1] * t[1]]);
        b.push(t[1]);
    }

    X = solve(a, b, true);
    matrix = [
        X[0], X[3], 0, X[6],
        X[1], X[4], 0, X[7],
        0, 0, 1, 0,
        X[2], X[5], 0, 1
    ].map(function (x) {
            return Number(x.toFixed(6));
        });

    return matrix; // css matrix3d coefficients to given transformation
}