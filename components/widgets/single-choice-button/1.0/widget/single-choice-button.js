class SingleChoiceButton extends WidgetBase {

    constructor(functionInfo, userInterface, targetID, configuration) {
        super(functionInfo, userInterface, targetID, configuration);

        this.active = false;
        this.outputTypeClass = null;
        this.requestInProgress = false;
        this.widgetID = 'er_single_choice_button_' + this.widgetID;
        $("#" + targetID).append("<button id='" + this.widgetID + "' class='easy-reading-single-choice'><img src='" + functionInfo.source.defaultIconURL + "' title='" + functionInfo.source.name + ": " + functionInfo.source.description + "'> </button>");

        this.enable();
        globalEventListener.addWidgetActivatedListeners(this);
    }


    enable() {
        $("#" + this.widgetID).on("click", this, this.singleChoiceButtonClicked);

    }

    disable() {
        $("#" + this.widgetID).off("click", this, this.singleChoiceButtonClicked);
        globalEventListener.removeWidgetActivatedListeners(this);

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
                case AnnotatedParagraph.className:
                    globalEventListener.addParagraphClickListener(this);
                    break;
                default:
                    break;
            }
            this.outputTypeClass = this.functionInfo.source.inputTypes[i].inputType;
        }

        globalEventListener.widgetActivated(this);

        this.active = true;

    }

    deactivateWidget(){
        super.deactivateWidget();
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
                case AnnotatedParagraph.className:
                    globalEventListener.removeParagraphClickListener(this);
                    break;
                default:
                    break;



            }

        }

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

            if(this.outputTypeClass === Paragraph.className){

                requestManager.createRequest(this, paragraph);
            }else if(this.outputTypeClass === AnnotatedParagraph.className){

                paragraph.type = AnnotatedParagraph.className;
                requestManager.createRequest(this, paragraph);
            }
        }


    }

    filterUserInterfaceElements(element){
        return $(element).parents('.easy-reading-interface').length;
    }


    requestFinished(){
        easyReading.busyAnimation.stopAnimation();
        this.requestInProgress = false;
    }

    remove(){
        if(this.active){
            this.deactivateWidget();
        }
        this.disable();
        $("#" + this.widgetID).remove();

    }
}