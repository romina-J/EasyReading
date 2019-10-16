class Request {
    constructor(id, input, uiId, toolId, functionInfo) {
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
        }

    }

    belongsToWidget(widget) {

        return this.uiId === widget.userInterface.uiId && this.toolId === widget.toolId && this.functionInfo === widget.functionInfo;
    }


}


let requestManager = {
    currentRequestID: 1,
    activeRequests: [],
    createRequest: function (widget, input) {

        if (widget.functionInfo.source.type === "LocalFunction") {
            functionMapping[widget.functionInfo.source.entryPoint](input, widget.functionInfo.configuration);
            //   window[widget.functionInfo.source.entryPoint](input, widget.functionInfo.configuration);

        } else if (widget.functionInfo.source.type === "RemoteFunction") {


            let currentRequest = new Request(this.currentRequestID++, input, widget.userInterface.uiIndex, widget.toolIndex, widget.functionInfo);

            this.activeRequests.push(currentRequest);
            contentScriptController.sendMessageToBackgroundScript(currentRequest.message);

        } else if (widget.functionInfo.source.type === "CombinedFunction") {


            let currentRequest = new Request(this.currentRequestID++, input, widget.userInterface.uiIndex, widget.toolIndex, widget.functionInfo);

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

    }


};

