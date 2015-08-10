describe("_INT function test-suite", function () {
    'use strict';

    beforeEach(function(){
       window._LANG_["1094978881"] = "Tcheburashka";
       window._LANG_["3332479872"] = "Tcheburashka-%s";
    });

    it('should return string itself for unknown string', function () {
        expect(_INT("Боевой шушпанцер")).toEqual("Боевой шушпанцер");
    });

    it('should return translated string for known string', function(){
        expect(_INT("Чебурашка")).toEqual("Tcheburashka");
    });

    it('should return translated string for known string', function(){
        expect(_INT("%s боевых шушпанцеров", 38)).toEqual("38 боевых шушпанцеров");
        expect(_INT("%s %s боевых шушпанцеров", 38)).toEqual("38 %s боевых шушпанцеров");
        expect(_INT("%s боевых шушпанцеров", 38, 38)).toEqual("38 боевых шушпанцеров");
        expect(_INT("%s боевых шушпанцеров")).toEqual("%s боевых шушпанцеров");
        expect(_INT("Чебурашка", 38)).toEqual("Tcheburashka");
        expect(_INT("Чебурашка-%s")).toEqual("Tcheburashka-%s");
        expect(_INT("Чебурашка-%s", 80)).toEqual("Tcheburashka-80");
    });
});