class ContinuousChoiceButton extends WidgetBase {

    constructor(functionInfo, userInterface, targetID, configuration) {
        super(functionInfo, userInterface, targetID, configuration);

        this.active = false;
        this.requestInProgress = false;
        this.widgetID = 'er_continuous_choice_button_' + userInterface.id + "_" + functionInfo.source.id;
        $("#" + targetID).append("<button id='" + this.widgetID + "' class='easy-reading-continuous-choice'><img src='" + functionInfo.source.defaultIconURL + "' title='" + functionInfo.source.name + ": " + functionInfo.source.description + "'> </button>");

        globalEventListener.addPresentationFinishListener(this);

        this.htmlIterator = null;
        this.textSelection = null;
        this.enable();

        globalEventListener.addWidgetActivatedListeners(this);

    }


    enable() {
        $("#" + this.widgetID).on("click", this, this.continuousChoiceButtonClicked);

    }

    disable() {
        $("#" + this.widgetID).off("click", this, this.continuousChoiceButtonClicked);


    }

    activateWidget(){
        console.log("continuous Choice Button Active");
        $("#" + this.widgetID).addClass("easy-reading-continuous-choice-active");
        for (let i = 0; i < this.functionInfo.source.inputTypes.length; i++) {
            switch (this.functionInfo.source.inputTypes[i].inputType) {
                case Word.className:
                    globalEventListener.addWordClickListener(this);
                    break;
                case Paragraph.className:
                    globalEventListener.addParagraphClickListener(this);
                    break;
                default:
                    break;
            }
        }

        globalEventListener.widgetActivated(this);

        this.active = true;
    }

    deactivateWidget(){
        console.log("continuous Choice Button Not Active");
        $("#" + this.widgetID).removeClass("easy-reading-continuous-choice-active");

        for (let i = 0; i < this.functionInfo.source.inputTypes.length; i++) {
            switch (this.functionInfo.source.inputTypes[i].inputType) {
                case Word.className:
                    globalEventListener.removeWordClickListener(this);
                    break;
                case Paragraph.className:
                    globalEventListener.removeParagraphClickListener(this);
                    break;
                default:
                    break;
            }
        }


        if(easyReading.userInterfaces[this.userInterface.uiId]){
            if(easyReading.userInterfaces[this.userInterface.uiId].tools[this.toolId]){
                if(easyReading.userInterfaces[this.userInterface.uiId].tools[this.toolId].presentation){
                    easyReading.userInterfaces[this.userInterface.uiId].tools[this.toolId].presentation.removeResult();
                }
            }
        }

        if(this.htmlIterator){
            this.htmlIterator.normalizeOldTextNodes();
        }
        requestManager.cancelRequest(this);

        this.active = false;
    }

    continuousChoiceButtonClicked(e) {

        if(e.data.active){
            e.data.deactivateWidget();
        }else{
            e.data.activateWidget();
        }
    }

    onWordClick(word, e) {
        if(this.requestInProgress){
            return;
        }
        this.requestInProgress = true;

        easyReading.busyAnimation.startAnimation();

        if(!this.filterUserInterfaceElements(word)){
            requestManager.createRequest(this, word);
        }

    }

    onParagraphCLick(paragraph, e) {
        if(this.requestInProgress){
            return;
        }
        this.requestInProgress = true;
        easyReading.busyAnimation.startAnimation();

        if(!this.filterUserInterfaceElements(paragraph)){

            this.htmlIterator = new HTMLIterator(paragraph.element);


            let currentParagraph = this.htmlIterator.getNextElements();
            if(currentParagraph){
                this.textSelection =  new TextSelection(currentParagraph.textNodes,500);
                let nextParagraph = this.textSelection.getNextParagraph();
                if(nextParagraph){
                    requestManager.createRequest(this, nextParagraph);
                }
            }

        }


    }

    filterUserInterfaceElements(element){
        return $(element).parents('.easy-reading-interface').length;
    }

    presentationFinished(presentation){

        let nextParagraph = this.textSelection.getNextParagraph();
        if(nextParagraph){
            requestManager.createRequest(this, nextParagraph);
        }else{
            let nextElements = this.htmlIterator.getNextElements();
            if(nextElements){
                this.textSelection =  new TextSelection(nextElements.textNodes,500);
                nextParagraph = this.textSelection.getNextParagraph();
                if(nextParagraph){
                    requestManager.createRequest(this, nextParagraph);
                }
            }
        }



    }
    widgetActivated(widget){
        if(widget !== this){

           this.deactivateWidget();
        }

    }
    requestFinished(){
        easyReading.busyAnimation.stopAnimation();
        this.requestInProgress = false;
    }

    remove(){

        $("#" + this.widgetID).off("click", this, this.continuousChoiceButtonClicked);
    }
}