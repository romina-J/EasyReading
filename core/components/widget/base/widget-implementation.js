class WidgetBase{

    constructor(functionInfo, userInterface,targetID, configuration){
        this.functionInfo = functionInfo;
        this.userInterface = userInterface;
        this.targetID = targetID;
        this.configuration = configuration;
        this.toolId = this.functionInfo.toolId;
    }

    disable(){

    }

    enable(){

    }


    presentationFinished(presentation){

    }

    widgetActivated(widget){

    }

    requestFinished(){

    }

    getPresentation(){

        return this.userInterface.tools[this.toolId].presentation;
    }

    stopPresentation(){

        let presentation = this.getPresentation();

        if(presentation){
            presentation.removeResult();
        }


    }

    remove(){
        console.log("Removing widget:");
    }


}