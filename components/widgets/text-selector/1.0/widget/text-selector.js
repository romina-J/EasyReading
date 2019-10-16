class TextSelector extends WidgetBase {

    constructor(functionInfo, userInterface, targetID, configuration) {
        super(functionInfo, userInterface, targetID, configuration);

        this.widgetID = 'er_button_' + this.widgetID;
        $("#" + targetID).append("<button id='" + this.widgetID + "' class='easy-reading-button'><img src='" + functionInfo.source.defaultIconURL + "' title='" + functionInfo.source.name + ": " + functionInfo.source.description + "'> </button>");
        globalEventListener.addPresentationFinishListener(this);

        globalEventListener.addPresentationFinishListener(this);
        globalEventListener.addWidgetActivatedListeners(this);
        this.enable();
    }

    enable() {
        $("#" + this.widgetID).on("click", this, this.buttonClicked);

    }

    disable() {
        $("#" + this.widgetID).off("click", this, this.buttonClicked);


    }

    buttonClicked(e) {

        if(this.active){

            e.data.deactivateWidget();
            $("#" + e.data.widgetID).removeClass("easy-reading-text-selector-active");

        }


        let selectedText = pageUtils.getSelectedText();



        if(selectedText.textNodes){
            this.active = true;
            e.data.textSelection =  new TextSelection(selectedText.textNodes,500);

            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }else if (document.selection) {
                document.selection.empty();
            }


            let nextParagraph = e.data.textSelection.getNextParagraph();


            console.log(nextParagraph);

            requestManager.createRequest(e.data, nextParagraph);

            $("#" + e.data.widgetID).addClass("easy-reading-text-selector-active");
        }


    }

    presentationFinished(presentation){

        let nextParagraph = this.textSelection.getNextParagraph();
        if(nextParagraph){
            requestManager.createRequest(this, nextParagraph);
        }
        $("#" + this.widgetID).removeClass("easy-reading-text-selector-active");
        this.active = false;

    }
    remove(){
        $("#"+this.widgetID).remove();
    }
}
