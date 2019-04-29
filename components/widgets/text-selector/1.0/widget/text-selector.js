class TextSelector extends WidgetBase {

    constructor(functionInfo, userInterface, targetID, configuration) {
        super(functionInfo, userInterface, targetID, configuration);

        this.widgetID = 'er_button_' + userInterface.id + "_" + functionInfo.source.id;
        $("#" + targetID).append("<button id='" + this.widgetID + "' class='easy-reading-button'><img src='" + functionInfo.source.defaultIconURL + "' title='" + functionInfo.source.name + ": " + functionInfo.source.description + "'> </button>");
        globalEventListener.addPresentationFinishListener(this);
        this.enable();
    }

    enable() {
        $("#" + this.widgetID).on("click", this, this.buttonClicked);

    }

    disable() {
        $("#" + this.widgetID).off("click", this, this.buttonClicked);


    }

    buttonClicked(e) {



        let selectedText = pageUtils.getSelectedText();



        if(selectedText.textNodes){
            e.data.textSelection =  new TextSelection(selectedText.textNodes,500);

            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }else if (document.selection) {
                document.selection.empty();
            }


            let nextParagraph = e.data.textSelection.getNextParagraph();


            console.log(nextParagraph);

            requestManager.createRequest(e.data, nextParagraph);
            console.log(e.data);
        }


    }

    presentationFinished(presentation){

        let nextParagraph = this.textSelection.getNextParagraph();
        if(nextParagraph){
            requestManager.createRequest(this, nextParagraph);
        }

    }
}
