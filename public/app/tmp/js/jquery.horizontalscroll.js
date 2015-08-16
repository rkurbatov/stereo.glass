(function ($) {
    'use strict';

    var lsKey = 'jQuery.horizon'; // localStorage key

    $.fn.horizon = function (options, i) {
        if (options === 'scrollLeft') {
            scrollLeft();
        } else if (options === 'scrollRight') {
            scrollRight();
        } else if (options === 'scrollTo') { // TODO: Should verify i here
            scrollTo(i, $.fn.horizon.defaults.scrollDuration);
        } else {
            $.extend($.fn.horizon.defaults, options);

            $.fn.horizon.defaults.sections = this;
            $.fn.horizon.defaults.limit = this.length;
            $.fn.horizon.defaults.i = getFromStorage();

            sizeSections();

            $(window).on('resize', function () {
                sizeSections();
            });

            $(window).on('carousel:scrollLeft', scrollLeft);
            $(window).on('carousel:scrollRight', scrollRight);

            return this;
        }
    };

    var getFromStorage = function(key) {
        if (!!window.localStorage) {
            var idx = Number(window.localStorage[lsKey]);
            if (idx !== idx) {
                window.localStorage[lsKey] = 0;
                return 0;
            } else {
                return idx;
            }
        } else {
            return 0;
        }
    };

    var putToStorage = function(value) {
        if (!!window.localStorage) {
            window.localStorage[lsKey] = value;
        }
    };

    $.fn.horizon.defaults = {
        scrollTimeout: null,
        scrollEndDelay: 250,
        scrollDuration: 500,
        i: getFromStorage(),
        limit: 0,
        docWidth: 0,
        sections: null,
        swipe: true,
        fnCallback: function (i) {}
    };

    // HTML animate does not work in webkit. BODY does not work in opera.
    // For animate, we must do both.
    // http://stackoverflow.com/questions/8790752/callback-of-animate-gets-called-twice-jquery
    var scrollTo = function (index, speed) {
        if (index > ($.fn.horizon.defaults.limit - 1) || index < 0) {
            //console.log('Scroll where? I think you want me to go out of my limits. Sorry, no can do.');
            return;
        }

        //console.log('Scroll to: ' + index);
        $.fn.horizon.defaults.i = index;
        putToStorage(index);

        var $section = $($.fn.horizon.defaults.sections[index]);
        $('html,body').animate({scrollLeft: $section.offset().left}, speed, 'swing', $.fn.horizon.defaults.fnCallback(index));


        $(window).trigger({type: 'carousel:scroll', index: index});
    };

    var scrollLeft = function () {
        //console.log('Scroll left');

        var i2 = $.fn.horizon.defaults.i - 1;

        if (i2 > -1) {
            scrollTo(i2, $.fn.horizon.defaults.scrollDuration);
        } else {
            scrollTo($.fn.horizon.defaults.limit-1, 2*$.fn.horizon.defaults.scrollDuration);
        }
    };

    var scrollRight = function () {
        //console.log('Scroll right');
        console.log($.fn.horizon.defaults);

        var i2 = $.fn.horizon.defaults.i + 1;

        if (i2 < $.fn.horizon.defaults.limit) {
            scrollTo(i2, $.fn.horizon.defaults.scrollDuration);
        } else {
            scrollTo(0, 2*$.fn.horizon.defaults.scrollDuration);
        }
    };


    var sizeSections = function () {
        //console.log('Sizing sections...');
        $(window).trigger('carousel:resize');
        scrollTo($.fn.horizon.defaults.i, 0);
    };

})
(jQuery);

// SCROLLING NOTES
// http://stackoverflow.com/questions/4989632/differentiate-between-scroll-up-down-in-jquery
// http://stackoverflow.com/questions/4289473/javascript-do-an-action-after-user-is-done-scrolling