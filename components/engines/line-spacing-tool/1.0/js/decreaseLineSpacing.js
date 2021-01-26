function decreaseLineHeight(req, config) {
    initLineHeight();
    lineHeight--;
    $('*').each(function () {
        if(!$(this).parents('.easy-reading-interface').length){
            let el = $(this);
            let size = el.data('line-height');
            el.css('line-height', Math.max(size + lineHeight, 0) + 'px');
        }

    });
}