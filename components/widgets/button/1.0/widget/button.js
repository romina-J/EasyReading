class Button extends WidgetBase{

    constructor(functionInfo, userInterface,targetID, configuration){
        super(functionInfo,userInterface,targetID,configuration);

        this.widgetID = 'er_button_'+userInterface.id+"_"+functionInfo.source.id;
        $("#"+targetID).append("<button id='"+this.widgetID+"' class='easy-reading-button'><img src='"+functionInfo.source.defaultIconURL+"' title='"+functionInfo.source.name+": "+functionInfo.source.description+"'> </button>");
        this.enable();
    }

    enable(){
        $("#"+this.widgetID).on( "click",this, this.buttonClicked);

    }

    disable(){
        $("#"+this.widgetID).off( "click",this, this.buttonClicked);


    }

    buttonClicked(e){
        let input = null;

        requestManager.createRequest(e.data,input);

    }
}
