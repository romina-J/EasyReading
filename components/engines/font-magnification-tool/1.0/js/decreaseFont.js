function shrinkFont(req, config) {
    initFontMagnification();
    zoom--;
    $('*').each(function () {
        if(!$(this).parents('.easy-reading-interface').length){
            let el = $(this);
            let size = el.data('font-size');
            el.css('font-size', Math.max(size + zoom, 0) + 'px');
        }

    });
}
