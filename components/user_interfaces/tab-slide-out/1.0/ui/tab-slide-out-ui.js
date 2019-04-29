class TabSlideOutUserInterface extends UserInterfaceBase{
    constructor(configuration){
        super(configuration);

        this.configuration = configuration;
        this.currentToolId =1;
    }

    initUI(){

        $("body").append('<div id="easy-reading-tab-slide-out" class="easy-reading-interface"  style="z-index: 99999"><a class="handle"><div id="tab-slide-out-handle"></div></a><div id="tab-slide-out-grid-container"></div></div>');
        $('#easy-reading-tab-slide-out').tabSlideOut({
            tabLocation: 'right', // optional, default is 'left'
            clickScreenToClose: false,
        });


    }


    show(){

        $("#easy-reading-tab-slide-out").show();
    }

    hide(){

        $("#easy-reading-tab-slide-out").hide();
    }

    getContainerIDForLayout(layout){

        let currentContainerID = "tab-slide-out-container-"+this.currentToolId;
        this.currentToolId++;
        $('#tab-slide-out-grid-container').append('<div class="tab-slide-out-grid-item" id="'+currentContainerID+'"></div>');
        return currentContainerID;
    }

    remove(){
        $( "#easy-reading-tab-slide-out" ).remove();
    }

}