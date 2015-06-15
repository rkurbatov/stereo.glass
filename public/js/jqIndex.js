/**
 * Created by Роман on 01.04.2015.
 */
/*jshint browser: true*/
/*jshint latedef: nofunc*/
/*global $, _, jQuery*/

(function ($) {
    'use strict';

    // initialization and redraw reset
    $(window).on("load resize orientationchange", positionButtons);
    $(window).on("load", setBlickSpeed);
    $(window).on("load", initBlinkAnimations);
    $(window).on("load", function(){
        $('.sg-hor-scroll').horizon({swipe: true});
    });

    /*$(window).on("load resize orientationchange", function () {
        var ww = $(window).width(), wh = $(window).height();
        var imgHeight = ww * 800 / 1500;
        var centerDelta = (wh - imgHeight) / 2;
        //$('section.sg-hor-scroll .sg-plate-3d').css({'marginTop': centerDelta});
        //reDraw3d();
    });*/

    /*function reDraw3d() {
        $('#sg-lines-3d').drawPlate3D('.sg-main-sec1 .bg-room');
        $('#sg-buddha-3d').drawPlate3D('.sg-main-sec1 .bg-room');
        $('#sg-kitchen-wall1-3d').drawPlate3D('.sg-main-sec2 .bg-room');
        $('#sg-kitchen-wall2-3d').drawPlate3D('.sg-main-sec2 .bg-room');
        $('#sg-kitchen-wall3-3d').drawPlate3D('.sg-main-sec2 .bg-room');
        $('#sg-kitchen-floor').drawPlate3D('.sg-main-sec2 .bg-room');
        $('#sg-teddybear-3d').drawPlate3D('.sg-main-sec3 .bg-room');
        $('#sg-teddyhare-3d').drawPlate3D('.sg-main-sec3 .bg-room');
        $('#sg-teddycat-3d').drawPlate3D('.sg-main-sec3 .bg-room');
        $('#sg-pavilion-3d').drawPlate3D('.sg-main-sec4 .bg-room');
        $('#sg-mirror-3d').drawPlate3D('.sg-main-sec4 .bg-room');
        $('#sg-bathroom-floor').drawPlate3D('.sg-main-sec4 .bg-room');
        $('#aqua-left-3d').drawPlate3D('.sg-main-sec5 .bg-room');
        $('#aqua-right-3d').drawPlate3D('.sg-main-sec5 .bg-room');
        $('#sg-club-floor').drawPlate3D('.sg-main-sec5 .bg-room');
        $('#coffee-3d').drawPlate3D('.sg-main-sec6 .bg-room');
        $('#strawberry-3d').drawPlate3D('.sg-main-sec6 .bg-room');
        $('#citrus-3d').drawPlate3D('.sg-main-sec6 .bg-room');
        $('#beeline-3d').drawPlate3D('.sg-main-sec6 .bg-room');
        $('#cube-3d').drawPlate3D('.sg-main-sec6 .bg-room');
    }*/

    function initBlinkAnimations() {
        $($('#menu-top')[0].children).each(
            function (i) {
                setBlinkInterval('#menu-top :nth-child(' + (i + 1) + ') :nth-child(1)', rnd(15, 25), rnd(5, 9));
            }
        );
        setBlinkInterval('#logo-blicker', rnd(15, 18), rnd(3, 5));
        $($('#menu-product')[0].children).each(
            function (i) {
                setBlinkInterval('#menu-product :nth-child(' + (i + 1) + ') :nth-child(1)', rnd(12, 20), rnd(1, 5));
            }
        );
    }

    function positionButtons() {
        //$('#ratiometer').html(($(window).width()/$(window).height()).toFixed(2));
        var list = $("header ul")[0],
            logoUpper = $("#logo-upper")[0],
            logoBlicker = $("#logo-blicker")[0],
            inpSearch = $("#search-input"),
            btnLogin = $("#login-button"),
            dx;

        if (list && list.children.length > 4 && list.children[list.children.length - 1]) {
            dx = $(list.children[list.children.length - 1]).innerWidth() / 4;

            if (logoUpper && logoBlicker) {
                $(logoBlicker).outerWidth($(logoUpper).outerWidth());
                $(logoBlicker).outerHeight($(logoUpper).outerHeight());
            }

            if (btnLogin) {
                btnLogin.innerWidth($(list.children[list.children.length - 2]).innerWidth() + $(list.children[list.children.length - 1]).innerWidth() - 2 * dx);
                btnLogin.offset({left: $(list.children[list.children.length - 2]).offset().left + dx});
            }

            if (inpSearch) {
                inpSearch.innerWidth($(list.children[0]).innerWidth() + $(list.children[1]).innerWidth() + $(list.children[2]).innerWidth() - 2 * dx);
                inpSearch.offset({left: $(list.children[0]).offset().left + dx});
            }


        }
    }

    function setBlickSpeed() {

        var k = 200, // px per s
            prodMenuList = $('#menu-product')[0],
            topMenuList = $('#menu-top')[0],
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

}(jQuery));