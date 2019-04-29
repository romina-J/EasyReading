class SingleChoiceButton extends WidgetBase {

    constructor(functionInfo, userInterface, targetID, configuration) {
        super(functionInfo, userInterface, targetID, configuration);

        this.active = false;
        this.requestInProgress = false;
        this.widgetID = 'er_single_choice_button_' + userInterface.id + "_" + functionInfo.source.id;
        $("#" + targetID).append("<button id='" + this.widgetID + "' class='easy-reading-single-choice'><img src='" + functionInfo.source.defaultIconURL + "' title='" + functionInfo.source.name + ": " + functionInfo.source.description + "'> </button>");

        this.enable();
        globalEventListener.addWidgetActivatedListeners(this);
    }


    enable() {
        $("#" + this.widgetID).on("click", this, this.singleChoiceButtonClicked);

    }

    disable() {
        $("#" + this.widgetID).off("click", this, this.singleChoiceButtonClicked);


    }

    activateWidget(){
        console.log("Single Choice Button Active");
        $("#" + this.widgetID).addClass("easy-reading-single-choice-active");
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
        console.log("Single Choice Button Not Active");
        $("#" + this.widgetID).removeClass("easy-reading-single-choice-active");

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
        requestManager.cancelRequest(this);

        this.active = false;
    }

    singleChoiceButtonClicked(e) {
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
            requestManager.createRequest(this, paragraph);
        }


    }

    filterUserInterfaceElements(element){
        return $(element).parents('.easy-reading-interface').length;
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
}