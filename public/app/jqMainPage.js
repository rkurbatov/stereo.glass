/**
 * Created by Роман on 01.04.2015.
 */
/*jshint browser: true*/
/*jshint latedef: nofunc*/
/*global $, _, jQuery*/
(function ($, window, undefined) {
    'use strict';

    // initialization and redraw reset
    $(window).on("load resize orientationchange", positionElements);

    function setViewport() {
        if (window.isMobile.apple.phone) {
            var windowWidth = ( $(window).width() < window.screen.width )
                ? $(window).width()
                : window.screen.width; //get proper width
            var minimalWidth = 480; // min width of site
            if (windowWidth > minimalWidth) {
                $('#Viewport').attr('content', 'initial-scale=1.0, maximum-scale=2, minimum-scale=1.0, user-scalable=yes, minimal-ui, width=' + windowWidth);
            }
        }
    }

    function positionElements() {
        setViewport();
        // make header screen width
        if (window.innerWidth > 480) {
            $('header').width(window.innerWidth);
        } else {
            $('header').width('');
        }
        var list = $("ul.menu-pages")[0],
            items = list.children,
            menuLen = list
                ? items.length
                : 0,
            logoUpper = $(".logo-upper")[0],
            logoBlicker = $(".logo-blicker")[0],
            inpSearchForm = $("form[name='search']"),
            inpSearch = $("#search-input"),
            btnLogin = $("#login-button"),
            btnAdmin = $("#admin-button"),
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

            if (btnAdmin) {
                btnAdmin.innerWidth($(items[menuLen - 2]).innerWidth() + $(items[menuLen - 1]).innerWidth() - 2 * dx);
                btnAdmin.offset({left: $(items[menuLen - 2]).offset().left + dx});
            }

            if (inpSearch) {
                var inpWidth = $(items[0]).innerWidth() + $(items[1]).innerWidth() + $(items[2]).innerWidth() - 2 * dx;
                inpSearch.innerWidth(inpWidth);
                inpSearchForm.offset({left: $(items[0]).offset().left + dx});
            }

        }
    }

}(jQuery, window));