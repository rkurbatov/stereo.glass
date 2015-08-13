/**
 * Created by Роман on 01.04.2015.
 */
/*jshint browser: true*/
/*jshint latedef: nofunc*/
/*global $, _, jQuery*/
(function ($, window, undefined) {
    'use strict';

    // initialization and redraw reset
    $(window).on("load", ()=> $('.sg-hor-scroll').horizon({swipe: true}));
    $(window).on("load resize orientationchange", positionElements);

    function positionElements() {
        // make header screen width
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

        _.each($('.sg-l2-wrapper'), (wrapper)=> {
            var winHeight = $(window).height();
            var marginTop = parseInt($(wrapper).css('marginTop'), 10);
            $(wrapper).height(winHeight - marginTop - 5)
        });
    }

}(jQuery, window));