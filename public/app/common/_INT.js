(function (window, undefined) {
    'use strict';

    var _LANG_ = {};

    window._INT = _INT;
    window._LANG_ = _LANG_;


    function _INT(str) {
        var hashedString = String(hashFnv32a(str));
        var args = [];
        for (var i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        if (_LANG_[hashedString]) {
            return sprintf(_LANG_[hashedString], args);
        } else {
            return sprintf(str, args);
        }
    }

    function hashFnv32a(str) {
        /*jshint bitwise:false */
        var i, l,
            hval = 0x811c9dc5;

        for (i = 0, l = str.length; i < l; i++) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        return hval >>> 0;
    }

    function sprintf(str, args) {
        for (var i = 0; i < args.length; i++) {
            str = str.replace(/%s/, args[i]);
        }
        return str;
    }

})(window);
