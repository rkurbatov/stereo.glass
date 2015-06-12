;

(function ($) {
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

    $.fn.drawPlate3D = function (objectSelector, cornerPoints, dimensions) {
        var background = $(objectSelector)[0],
            plate = this,
            nonScaledWidth, nonScaledHeight, scaleX, scaleY;

        if (dimensions) {
            nonScaledWidth = dimensions.width;
            nonScaledHeight = dimensions.height;
        } else {
            nonScaledWidth = background.naturalWidth;
            nonScaledHeight = background.naturalHeight;
        }

        scaleX = $(background).width() / nonScaledWidth;
        scaleY = $(background).height() / nonScaledHeight;

        var transform = ["", "-webkit-", "-moz-", "-ms-", "-o-"].reduce(function (p, v) {
                return v + "transform" in document.body.style ? v : p;
            }) + "transform";

        var sourcePoints = [[0, 0], [plate.width(), 0], [plate.width(), plate.height()], [0, plate.height()]],
            targetPoints, X, matrix;

        if (cornerPoints) {
            targetPoints = $.extend(true, [], cornerPoints);
        } else {
            targetPoints = $.extend(true, [], plate.data('targets'));
        }

        for (var a = [], b = [], i = 0, n = sourcePoints.length; i < n; ++i) {
            var s = sourcePoints[i], t = targetPoints[i];
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

        var cssObj = {}, originPropName = transform + "-origin";
        cssObj[originPropName] = "0 0";
        cssObj[transform] = "matrix3d(" + matrix + ")";
        cssObj['left'] = background.offsetLeft + 'px';
        cssObj['top'] = background.offsetTop - $(background).css("margin-top").replace("px", "") + 'px';
        cssObj['display'] = 'block';

        plate.css(cssObj);
    }

})(jQuery);