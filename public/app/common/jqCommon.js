(function ($) {

    'use strict';

    $(window).load(function () {

        // Init multicolor style (changing colors)
        $('.sg-multicolor').animate({color: '#909090'}, 500);
        setInterval(function () {
            var theColors = ['#ff0000', '#ffa500', '#8b4513', '#008000', '#1e80a0', '#8b008b'];
            var theColor = theColors[Math.floor(Math.random() * theColors.length)];
            $('.sg-multicolor').animate({color: theColor}, 1000);
        }, 1000);

    });

})(jQuery);
