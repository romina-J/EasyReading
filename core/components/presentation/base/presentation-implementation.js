class Presentation{
    constructor(functionInfo, userInterface,configuration){

        this.functionInfo = functionInfo;
        this.userInterface = userInterface;
        this.configuration = configuration;
        this.requestCounter = 0;
        this.isCompatibleWithOtherPresentations = false;


    }

    renderResult(request,result){

    }
    removeResult(resultID){

    }
    undo(){

    }

    remove(){
        console.log("Removing presentation");
    }

    removeAnimatedResult(){

    }

    getID(){
        return this.userInterface.uiId+"-"+this.functionInfo.toolId;
    }

    getPresentationAndRequestIdentifier(requestID){
        return 'data-presentationid="'+this.getID()+'" data-requestid="'+requestID+'"';
    }

    getResultClass(){
        return "easy-reading-result";
    }

    createRequestId(){
        this.requestCounter++;
        return "er-result-"+this.getID()+"-"+this.requestCounter;
    }

    setToolIndex(toolIndex){
        this.toolIndex = toolIndex;
    }

    getWidget(){

        return this.userInterface.tools[this.toolIndex].widget;
    }

    updateConfigurationAndFunction(configuration,functionInfo){
        this.functionInfo = functionInfo;
        this.configuration = configuration;
        this.toolId = this.functionInfo.toolId;
    }

}