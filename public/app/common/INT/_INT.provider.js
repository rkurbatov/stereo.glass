(function (window, angular, undefined) {
    'use strict';

    angular
        .module('sg.i18n', [])
        .constant('_INT', window._INT)          // use _INT as $rootScope constant
        .constant('_LANG_', window._LANG_)      // use _LANG_ as $rootScope constant
        .run(_INTProvider);

    _INTProvider.$inject = ['$rootScope'];
    function _INTProvider($rootScope) {
        $rootScope._INT = window._INT;
        $rootScope._LANG_ = window._LANG_;
    }

})(window, window.angular);
