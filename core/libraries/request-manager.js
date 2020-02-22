class Request {
    constructor(id, input, uiId, toolId, functionInfo,automaticRequest=false) {
        this.id = id;
        this.input = input;
        this.uiId = uiId;
        this.toolId = toolId;
        this.functionInfo = functionInfo;

        this.inputType = null;
        if (input) {

            switch (input.type) {
                case "Paragraph": {
                    this.inputType = new Paragraph(input.value,input.lang);

                }
                break;
                case "AnnotatedParagraph": {
                    this.inputType = new AnnotatedParagraph(input.value,[],input.lang);

                }
                    break;

                case "Word": {
                    this.inputType = new Word(input.value,input.lang,input.sentenceBegin,input.sentenceEnd);
                }
                    break;

                case "Void": {
                    this.inputType = new VoidIOType(input.description);
                }
                    break;


                case "URL": {
                    this.inputType = new URLType(input.url);
                }
                    break;


                default: {
                    console.log("input type not supported!...")
                }
            }
            /*
            inputInfo = {
                value:input.value,
                type:input.type,
                lang: input.lang,
            };*/
        }


        this.message = {
            id: id,
            type: "cloudRequest",
            ui: {
                uiId: uiId,
                toolId: toolId,
            },

            input: this.inputType,
            requestInfo : new RequestInfo(uiId,toolId,automaticRequest),

        };

        if (functionInfo.source.type === "RemoteFunction") {
            this.message.functionInfo =
                {
                    engineId: functionInfo.source.engine.id,
                    engineVersison: functionInfo.source.engine.version,
                    functionId: functionInfo.source.id,
                    configuration: functionInfo.configuration,
                    functionType: "RemoteFunction",

                };
        }else if(functionInfo.source.type === "CombinedFunction"){
            this.message.functionInfo =
                {
                    functionId: functionInfo.source.id,
                    functionType: "CombinedFunction",

                };
        }else if(functionInfo.source.type === "LocalFunction"){
            this.message.functionInfo =
                {
                    functionId: functionInfo.source.id,
                    functionType: "CombinedFunction",
                };
        }

    }

    belongsToWidget(widget) {

        return this.uiId === widget.userInterface.uiId && this.toolId === widget.toolId && this.functionInfo === widget.functionInfo;
    }


}
class RequestInfo{
    constructor(uiIndex, toolIndex,automaticRequest) {
        this.uiIndex = uiIndex;
        this.toolIndex = toolIndex;
        this.automaticRequest = automaticRequest;

        this.href = window.location.href;
        this.hostname = window.location.hostname;
        this.pathname = window.location.pathname;
        this.toolUsage = requestManager.getToolUsageEntry(uiIndex,toolIndex);
    }

}

let requestManager = {
    currentRequestID: 1,
    activeRequests: [],
    toolUsageEntries:[],
    createRequest: function (widget, input,automaticRequest=false) {

        if (widget.functionInfo.source.type === "LocalFunction") {
            functionMapping[widget.functionInfo.source.entryPoint](input, widget.functionInfo.configuration,widget);
            //   window[widget.functionInfo.source.entryPoint](input, widget.functionInfo.configuration);

            //Dont push this on active requests - it is local anyway
            let currentRequest = new Request(this.currentRequestID++, input, widget.userInterface.uiIndex, widget.toolIndex, widget.functionInfo,automaticRequest);
            contentScriptController.sendMessageToBackgroundScript(currentRequest.message);

        } else if (widget.functionInfo.source.type === "RemoteFunction") {


            let currentRequest = new Request(this.currentRequestID++, input, widget.userInterface.uiIndex, widget.toolIndex, widget.functionInfo,automaticRequest);

            this.activeRequests.push(currentRequest);
            contentScriptController.sendMessageToBackgroundScript(currentRequest.message);

        } else if (widget.functionInfo.source.type === "CombinedFunction") {


            let currentRequest = new Request(this.currentRequestID++, input, widget.userInterface.uiIndex, widget.toolIndex, widget.functionInfo,automaticRequest);

            this.activeRequests.push(currentRequest);
            contentScriptController.sendMessageToBackgroundScript(currentRequest.message);

        }


    },
    receiveRequestResult: function (result) {

        let request = this.getRequestForResult(result);

        if (request) {
            if (result.outputType === JavaScriptType.className) {
                eval(result.result.script);
            } else {

                result.result = ioTypeUtils.toIOTypeInstance(result.result);
                easyReading.userInterfaces[request.uiId].tools[request.toolId].presentation.renderResult(request, result);
            }

            easyReading.userInterfaces[request.uiId].tools[request.toolId].widget.requestFinished();

        }


    },

    getRequestForResult(result) {
        for (let i = 0; i < this.activeRequests.length; i++) {

            if (this.activeRequests[i].id === result.id) {

                let currentRequest = this.activeRequests[i];

                this.activeRequests.splice(i, 1);
                return currentRequest;
            }


        }
    },

    cancelRequest(widget) {
        for (let i = 0; i < this.activeRequests.length; i++) {
            if (this.activeRequests[i].belongsToWidget(widget)) {
                this.activeRequests.splice(i, 1);
                return;
            }
        }

    },

    getToolUsageEntry(uiIndex,toolIndex){

        let toolID = uiIndex+"_"+toolIndex;
        for(let i=0; i< requestManager.toolUsageEntries.length; i++){

            if(requestManager.toolUsageEntries[i].toolID === toolID){

                requestManager.toolUsageEntries[i].toolCount++;
                return requestManager.toolUsageEntries[i];
            }
        }

        let toolUsageEntry = {
            toolID:toolID,
            toolCount: 1,
        };
        requestManager.toolUsageEntries.push(toolUsageEntry);

        return toolUsageEntry;

    }


};

