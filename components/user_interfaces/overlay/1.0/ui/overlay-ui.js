class OverlayUserInterface extends UserInterfaceBase{
    constructor(configuration){
        super(configuration);

        this.configuration = configuration;
        this.currentToolId = 1;
    }

    initUI(){

        $("body").append('<div id="easy_reader_overlay_dialog" class="easy-reading-interface" title="Easy Reader"><p><div id="overlay-grid-container" class="easy-reader-controls-container"></div></p></div>');
        $("#easy_reader_overlay_dialog").dialog({ dialogClass: 'overlay-fixed-dialog' });

        $("#easy_reader_overlay_dialog").parent().addClass("easy-reading-interface");
        $(".ui-dialog").css('z-index', 9999999);

    }


    show(){

        $("#easy_reader_overlay_dialog").show();
    }

    hide(){

        $("#easy_reader_overlay_dialog").hide();
    }

    getContainerIDForLayout(layout){

        let currentContainerID = "overlay-container-"+this.currentToolId;
        this.currentToolId++;
        $('#overlay-grid-container').append('<div class="overlay-grid-item" id="'+currentContainerID+'"></div>');
        return currentContainerID;
    }

    remove(){
        $( "#easy_reader_overlay_dialog" ).dialog( "destroy" ).remove();
    }


}