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

            $(document).on('mousewheel DOMMouseScroll', function (e) {
                // Equalize event object.
                var evt = window.event || e;
                // Convert to originalEvent if possible.
                evt = evt.originalEvent ? evt.originalEvent : evt;
                // Check for detail first, because it is used by Opera and FF.
                var delta = evt.detail ? evt.detail * (-40) : evt.wheelDelta;

                scrollAction(delta);
            });

            if ($.fn.horizon.defaults.swipe) {
                $(document).swipe({
                    // Generic swipe handler for all directions.
                    swipe: function (event, direction, distance, duration, fingerCount) {
                        if (scrolls[direction]) {
                            scrolls[direction]();
                        }
                    },
                    threshold: 75
                });
            }

            $(window).on('resize', function () {
                sizeSections();
            }).on('keydown', function (e) {
                if (scrolls[e.which]) {
                    scrolls[e.which]();
                    e.preventDefault();
                }
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
        scrollDuration: 400,
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

        if (index === 0) {
            $('.horizon-prev').hide();
            $('.horizon-next').show();
        } else if (index === $.fn.horizon.defaults.limit - 1) {
            $('.horizon-prev').show();
            $('.horizon-next').hide();
        } else {
            $('.horizon-next').show();
            $('.horizon-prev').show();
        }

        $(window).trigger({type: 'carousel:scroll', index: index});
    };

    var scrollLeft = function () {
        //console.log('Scroll left');

        var i2 = $.fn.horizon.defaults.i - 1;

        if (i2 > -1) {
            scrollTo(i2, $.fn.horizon.defaults.scrollDuration);
        }
    };

    var scrollRight = function () {
        //console.log('Scroll right');

        var i2 = $.fn.horizon.defaults.i + 1;

        if (i2 < $.fn.horizon.defaults.limit) {
            scrollTo(i2, $.fn.horizon.defaults.scrollDuration);
        }
    };

    // Executes on 'scrollbegin'.
    var scrollBeginHandler = function (delta) {
        // Scroll up, Scroll down.
        if (delta > 1) {
            scrollLeft();
        } else if (delta < -1) {
            scrollRight();
        }
    };

    // Executes on 'scrollend'.
    var scrollEndHandler = function () {
        $.fn.horizon.defaults.scrollTimeout = null;
    };

    var scrollAction = function (delta) {
        if ($.fn.horizon.defaults.scrollTimeout === null) {
            scrollBeginHandler(delta);
        } else {
            clearTimeout($.fn.horizon.defaults.scrollTimeout);
        }

        $.fn.horizon.defaults.scrollTimeout = setTimeout(scrollEndHandler, $.fn.horizon.defaults.scrollEndDelay);
    };

    var sizeSections = function () {
        //console.log('Sizing sections...');

        $(window).trigger('carousel:resize');

        scrollTo($.fn.horizon.defaults.i, 0);
    };

    var scrolls = {
        'right': scrollLeft,
        'down': scrollLeft,
        'left': scrollRight,
        'up': scrollRight,
        37: scrollLeft,
        38: scrollLeft,
        39: scrollRight,
        40: scrollRight
    };
})
(jQuery);

// SCROLLING NOTES
// http://stackoverflow.com/questions/4989632/differentiate-between-scroll-up-down-in-jquery
// http://stackoverflow.com/questions/4289473/javascript-do-an-action-after-user-is-done-scrolling