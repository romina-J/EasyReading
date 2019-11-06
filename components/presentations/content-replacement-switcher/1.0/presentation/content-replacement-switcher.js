class ContentReplacementSwitcher extends Presentation {
    constructor(functionInfo, userInterface, configuration) {
        super(functionInfo, userInterface, configuration);
        this.requestCounter = 0;
        this.currentRequestID = null;
    }

    renderResult(request, result) {

        if(this.currentRequestID){
            this.removeResult();
        }

        let ioRes = ioTypeUtils.toIOTypeInstance(result.result);
        if (ioRes.name === "Error") {
            alertManager.showErrorAlert(ioRes.message);

        } else if (ioRes.name === "NoResult") {
            alertManager.showErrorAlert(ioRes.message);
        } else if (ioRes.name === "ContentReplacement") {

            let requestID = this.createRequestId();
            let resultClass = this.getResultClass();
            let presentationIdentifier = this.getPresentationAndRequestIdentifier(requestID);

            this.replacements = ioRes.replacements;
            this.currentRequestID = requestID;


            for(let i=0; i  < ioRes.replacements.length; i++){


                if(ioRes.replacements[i].type = "content_replacement"){

                    let replacementID = requestID+'-'+i;

                    $(ioRes.replacements[i].replacement.selector).addClass(resultClass + ' ' + replacementID + ' er-crs-original-text ' + presentationIdentifier);

                    let tagName = $(ioRes.replacements[i].replacement.selector).prop("tagName").toLowerCase();

                    $('<'+tagName+' class="' + resultClass + ' ' + replacementID + ' er-crs-replace-text" ' + presentationIdentifier + '>' + ioRes.replacements[i].replacement.replacement+ '</'+tagName+'>').insertAfter($("." + replacementID + ".er-crs-original-text").last());
                    $("." + replacementID + ".er-crs-replace-text").hide();

                    let button = $('<button class="easy-reading-button ' + resultClass + ' ' + replacementID + '" ' + presentationIdentifier + ' style="width: 2em;height: 2em;padding: 0;border: 0;"><img src="' + this.configuration.remoteAssetDirectory + '/help-logo.png" style="width: 2em;height: 2em;"></button>');
                    //button.insertAfter($("." + replacementID + ".er-crs-replace-text"));
                    button.insertBefore($(ioRes.replacements[i].replacement.selector));

                    button.click(function () {
                        $("." + replacementID + ".er-crs-original-text").toggle();
                        $("." + replacementID + ".er-crs-replace-text").toggle();
                        button.toggleClass('er-crs-active');
                    });

                }

            }
        }


    }

    undo() {

    }

    removeResult(requestID) {

        if(this.currentRequestID){

            let resultClass = this.getResultClass();
            let presentationIdentifier = this.getPresentationAndRequestIdentifier(this.currentRequestID);

            for(let i=0; i  < this.replacements.length; i++){


                if(this.replacements[i].type = "content_replacement"){

                    let replacementID = this.currentRequestID+'-'+i;

                    $(this.replacements[i].replacement.selector).removeClass(resultClass + ' ' + replacementID + ' er-crs-original-text ' + presentationIdentifier);
                    $(this.replacements[i].replacement.selector).show();
                    let tagName = $(this.replacements[i].replacement.selector).prop("tagName").toLowerCase();

                    $("." + replacementID + ".er-crs-replace-text").remove();
                    $("button." + replacementID).remove();
                }

            }

        }

        this.currentRequestID = null;
        this.replacments = [];
    }
}