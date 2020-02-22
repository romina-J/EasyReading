class AutoButton extends WidgetBase{

    constructor(functionInfo, userInterface,targetID, configuration){
        super(functionInfo,userInterface,targetID,configuration);

        this.widgetID = 'er_button_'+this.widgetID;
        $("#"+targetID).append("<button id='"+this.widgetID+"' class='easy-reading-button'><img src='"+functionInfo.source.defaultIconURL+"' title='"+functionInfo.source.name+": "+functionInfo.source.description+"'> </button>");
        this.enable();

        this.isActivated = false;

        let autoButton = this;
        $(document).ready(()=>{

            autoButton.toggle();
        });
    }

    enable(){
        $("#"+this.widgetID).on( "click",this, this.buttonClicked);

    }

    disable(){
        $("#"+this.widgetID).off( "click",this, this.buttonClicked);


    }

    buttonClicked(e){
        e.data.toggle();

    }

    toggle(){
        if(this.isActivated){
            $("#"+this.widgetID).removeClass("er-button-active");
            this.stopPresentation();
        }else{
            $("#"+this.widgetID).addClass("er-button-active");
            this.createRequest();
        }
        this.isActivated = !this.isActivated;
    }

    createRequest(){
        requestManager.createRequest(this,{
            type: "URL",
            url: window.location.href,
        }, true);
    }

    remove(){
        this.isActivated = false;
        $("#"+this.widgetID).remove();
    }
}
