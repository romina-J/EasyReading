class ParagraphSwitcher extends Presentation{
    constructor(functionInfo, userInterface,configuration){
        super(functionInfo, userInterface,configuration);
        this.requestCounter = 0;
    }

    renderResult(request,result){
        if(request.input.type === Paragraph.className) {

            for(let i=0; i < request.input.textNodes.length;i++){

                if($(request.input.textNodes[i]).closest(".easy-reading-result").length){

                    let classList = $(request.input.textNodes[i]).closest(".easy-reading-result").attr('class').split(/\s+/);

                    for(let j=0; j< classList.length; j++){
                        if(classList[j].indexOf("easy-reading-result-add-") !== -1){

                            let oldRequestID = classList[j].substring("easy-reading-result-add-".length, classList[j].length);

                            $(".easy-reading-result-orig-"+oldRequestID).contents()
                                .filter(function() {
                                    return this.nodeType === 3; //Node.TEXT_NODE
                                }).unwrap();
                            $(".easy-reading-result-add-"+oldRequestID).remove();

                        }else if(classList[j].indexOf("easy-reading-result-orig-") !== -1){

                            let oldRequestID = classList[j].substring("easy-reading-result-orig-".length, classList[j].length);
                            $(".easy-reading-result-orig-"+oldRequestID).contents()
                                .filter(function() {
                                    return this.nodeType === 3; //Node.TEXT_NODE
                                }).unwrap();
                            $(".easy-reading-result-add-"+oldRequestID).remove();

                        }

                    }
                }
            }

            let requestID = this.userInterface.uiId+"-"+this.functionInfo.toolId+"-"+this.requestCounter;
            let additionalResultClass = "easy-reading-result easy-reading-result-add-"+requestID;
            let originalClass = "easy-reading-result easy-reading-result-orig-"+requestID;
            let className = "easy-reading-paragraph-switcher-"+this.userInterface.uiId+"-"+this.functionInfo.toolId+"-"+this.requestCounter;
            let resultContainerID = "easy-reading-paragraph-switcher-result-"+this.userInterface.uiId+"-"+this.functionInfo.toolId+"-"+this.requestCounter;

            for(let i=0; i < request.input.textNodes.length; i++){
                $(request.input.textNodes[i]).wrap( '<span class="'+originalClass+'"></span>' );
                console.log(request.input.textNodes[i]);
            }


            $( "<span id='"+resultContainerID+"' class='"+additionalResultClass+" replacingInfo'>"+result.result.paragraph +"</span>" ).insertAfter($(".easy-reading-result-orig-"+requestID).last());
            let button = $('<button class="'+additionalResultClass+' easy-reading-interface" style="width: 2em;height: 2em;padding: 0;border: 0;"><img src="'+this.configuration.remoteAssetDirectory+'/help-logo.png" style="width: 2em;height: 2em;"></button>');
            button.insertAfter($("#"+resultContainerID));
            button.click(function() {
                $(".easy-reading-result-orig-"+requestID).toggle();
                $(".easy-reading-result-add-"+requestID+".replacingInfo").toggle();
            });
            $(".easy-reading-result-orig-"+requestID).hide();


            this.requestCounter++;

        }

    }

    undo(){

    }
}