
let easyReadingColorizeEnabled = false;
function colorize(req, config) {

    $("#easy-reading-colorize-style").remove();
    $("<style id='easy-reading-colorize-style' type='text/css'> .easyReaderColorize{ color:"+config.fontColor+" !important; background-color:"+config.backgroundColor+" !important;} </style>").appendTo("head");

    if(easyReadingColorizeEnabled){
        $("*").removeClass("easyReaderColorize");
    }else{
        $("*").each(function () {

            if(!$(this).parents('.easy-reading-interface').length && ! $(this).hasClass('easy-reading-interface')){
                $(this).addClass("easyReaderColorize");
            }
        });


    }

    easyReadingColorizeEnabled = !easyReadingColorizeEnabled;
}