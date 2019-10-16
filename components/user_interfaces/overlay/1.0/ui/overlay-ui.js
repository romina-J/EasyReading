class OverlayUserInterface extends UserInterfaceBase {
    constructor(configuration,tabConfiguration) {
        super(configuration,tabConfiguration);
        this.currentToolId = 1;
        this.toolsContainers = [];
    }

    initUI() {

        let userInterface = this;
        $("body").append('<div id="easy_reader_overlay_dialog" class="easy-reading-interface" title="Easy Reader"><p><div id="overlay-grid-container" class="easy-reader-controls-container"></div></p></div>');

        let position = { my: "center", at: "center", of: window };
        if(this.tabConfiguration){
            console.log(this.tabConfiguration);
            position = {
                my: "left+"+ this.tabConfiguration.left+" top+"+this.tabConfiguration.top,
                at: "left top",
                of: window,
            };
        }


        $("#easy_reader_overlay_dialog").dialog(
            {
                dialogClass: 'overlay-fixed-dialog no-close',
                dragStop: function (event, ui) {
                    uiUpdateManager.saveCurrentConfiguration(userInterface, ui.position);

                },
                position: position,

            });

        $("#easy_reader_overlay_dialog").parent().addClass("easy-reading-interface");
        $(".ui-dialog").css('z-index', 9999999);

    }


    show() {

        $("#easy_reader_overlay_dialog").show();
    }

    hide() {

        $("#easy_reader_overlay_dialog").hide();
    }

    getToolContainerIDForLayout(toolID,layoutConfig,order){
        let currentContainerID = "overlay-container-" + this.currentToolId;
        this.currentToolId++;

        let toolInfo = {
            toolID: toolID,
            containerID: currentContainerID,
        };
        let animatedCSSClass = "";
        if(typeof order !== "undefined"){
            animatedCSSClass = " overlay-animated";
        }
        if(typeof order !== "undefined" && order < this.toolsContainers.length) {


            let currentToolInThatOrder = this.toolsContainers[order];
            $("#"+currentToolInThatOrder.containerID).before('<div class="overlay-grid-item'+animatedCSSClass+'" id="'+currentContainerID+'"></div>');
            this.toolsContainers.splice(order,0,toolInfo);
        }else{

            $('#overlay-grid-container').append('<div class="overlay-grid-item'+animatedCSSClass+'" id="'+currentContainerID+'"></div>');
            this.toolsContainers.push(toolInfo);
        }

        return currentContainerID;
    }

    removeContainerForTool(toolID){
        for(let i=0; i < this.toolsContainers.length; i++){
            if(this.toolsContainers[i].toolID === toolID){


                $('#'+this.toolsContainers[i].containerID).remove();
                this.toolsContainers.splice(i,1);
                console.log("REMOVING:"+toolID);
                return;
            }
        }
    }

    remove() {
        $("#easy_reader_overlay_dialog").dialog("destroy").remove();
    }


}