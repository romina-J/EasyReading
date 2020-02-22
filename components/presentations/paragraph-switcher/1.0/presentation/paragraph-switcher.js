class ParagraphSwitcher extends Presentation {
    constructor(functionInfo, userInterface, configuration) {
        super(functionInfo, userInterface, configuration);
        this.requestCounter = 0;
    }

    renderResult(request, result) {

        let ioRes = ioTypeUtils.toIOTypeInstance(result.result);

        if (ioRes.name === "Error" ||ioRes.name === "NoResult" ) {

            if (!this.getWidget().continuesToCreateRequests) {
                alertManager.showErrorAlert(ioRes.message);
            }


        } else if (ioRes.name === "Paragraph") {

            if (request.input.type === Paragraph.className) {

                let requestID = this.createRequestId();
                let resultClass = this.getResultClass();
                let presentationIdentifier = this.getPresentationAndRequestIdentifier(requestID);

                for (let i = 0; i < request.input.textNodes.length; i++) {
                    $(request.input.textNodes[i]).wrap('<span class="' + resultClass + ' ' + requestID + ' er-ps-original-text" ' + presentationIdentifier + '></span>');
                }


                $('<span class="' + resultClass + ' ' + requestID + ' er-ps-replace-text" ' + presentationIdentifier + '>' + result.result.paragraph + '</span>').insertAfter($("." + requestID + ".er-ps-original-text").last());
                let button = $('<button class="' + resultClass + ' ' + requestID + '" ' + presentationIdentifier + ' style="width: 2em;height: 2em;padding: 0;border: 0;"><img src="' + this.configuration.remoteAssetDirectory + '/help-logo.png" style="width: 2em;height: 2em;"></button>');
                button.insertAfter($("." + requestID + ".er-ps-replace-text"));
                button.click(function () {
                    $("." + requestID + ".er-ps-original-text").toggle();
                    $("." + requestID + ".er-ps-replace-text").toggle();
                });
                $("." + requestID + ".er-ps-original-text").hide();



            }
        }

        globalEventListener.presentationFinished(this);


    }

    undo() {

    }

    removeResult(requestID) {

        //Remove button
        $("button." + requestID).remove();
        //Remove replace text
        $("." + requestID + ".er-ps-replace-text").remove();

        let original = $("." + requestID + ".er-ps-original-text");
        let parent = original.last().parent();
        original.contents().unwrap();

        if (parent.length) {
            parent.get(0).normalize();
        }

    }
}