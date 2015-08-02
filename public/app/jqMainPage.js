/**
 * Created by Роман on 01.04.2015.
 */
/*jshint browser: true*/
/*jshint latedef: nofunc*/
/*global $, _, jQuery*/

(function ($, window, undefined) {
    'use strict';

    // initialization and redraw reset
    $(window).on("load resize orientationchange", positionButtons);
    $(window).on("load", setBlickSpeed);
    $(window).on("load", initBlinkAnimations);
    $(window).on("load", function () {
        $('.sg-hor-scroll').horizon({swipe: true});
    });


    function initBlinkAnimations() {
        $(($('nav .menu-pages')[0] || {}).children).each(
            function (i) {
                setBlinkInterval('nav .menu-pages :nth-child(' + (i + 1) + ') :nth-child(1)', rnd(15, 25), rnd(5, 9));
            }
        );
        setBlinkInterval('#logo-blicker', rnd(15, 18), rnd(3, 5));
        $(($('#menu-product')[0] || {}).children).each(
            function (i) {
                setBlinkInterval('#menu-product :nth-child(' + (i + 1) + ') :nth-child(1)', rnd(12, 20), rnd(1, 5));
            }
        );
    }

    function positionButtons() {
        $('header').width(window.innerWidth);
        var list = $("ul.menu-pages")[0],
            items = list.children,
            menuLen = list
                ? items.length
                : 0,
            logoUpper = $("#logo-upper")[0],
            logoBlicker = $("#logo-blicker")[0],
            inpSearchForm = $("form[name='search']"),
            inpSearch = $("#search-input"),
            btnLogin = $("#login-button"),
            btnLogout = $("#logout-button"),
            dx;

        if (list && menuLen > 4 && list.children[menuLen - 1]) {
            dx = $(list.children[menuLen - 1]).innerWidth() / 4;

            if (logoUpper && logoBlicker) {
                $(logoBlicker).outerWidth($(logoUpper).outerWidth());
                $(logoBlicker).outerHeight($(logoUpper).outerHeight());
            }

            if (btnLogin) {
                btnLogin.innerWidth($(items[menuLen - 2]).innerWidth() + $(items[menuLen - 1]).innerWidth() - 2 * dx);
                btnLogin.offset({left: $(items[menuLen - 2]).offset().left + dx});
            }

            if (btnLogout) {
                btnLogout.innerWidth($(items[menuLen - 2]).innerWidth() + $(items[menuLen - 1]).innerWidth() - 2 * dx);
                btnLogout.offset({left: $(items[menuLen - 2]).offset().left + dx});
            }

            if (inpSearch) {
                var inpWidth = $(items[0]).innerWidth() + $(items[1]).innerWidth() + $(items[2]).innerWidth() - 2 * dx;
                inpSearch.innerWidth(inpWidth);
                inpSearchForm.offset({left: $(items[0]).offset().left + dx});
            }


        }
    }

    function setBlickSpeed() {

        var k = 200, // px per s
            prodMenuList = $('#menu-product')[0],
            topMenuList = $('nav .menu-pages')[0],
            logo = $('#logo-blicker');

        if (prodMenuList && prodMenuList.children.length > 0) {
            $(prodMenuList.children).each(function (i, el) {
                $(el).children().css('transition-duration', ($(el).innerWidth() / k) + "s");
            });
        }

        if (topMenuList && topMenuList.children.length > 0) {
            $(topMenuList.children).each(function (i, el) {
                $(el).children().css('transition-duration', ($(el).innerWidth() / k) + "s");
            });
        }

        if (logo) {
            $(logo).css('transition-duration', ($(logo).innerWidth() / k) + "s");
        }
    }

    function setBlinkInterval(selector, interval, ontime, delay) {
        ontime = ontime || 1000;
        if (delay && delay > 0) {
            setTimeout(setInterval(cbBlick, interval), delay);
        } else {
            setInterval(cbBlick, interval);
        }

        function cbBlick() {
            var el = $(selector);

            el.toggleClass('hovered');
            setTimeout(function () {
                el.toggleClass('hovered');
            }, ontime);
        }
    }

    function rnd(min, max) {
        return Math.floor(_.random(min, max, true) * 1000);
    }

}(jQuery, window));