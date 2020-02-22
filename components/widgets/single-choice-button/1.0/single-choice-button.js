let WidgetBase = rootRequire("core/components/widget/base/widget-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class SingleChoiceButton extends WidgetBase{
    constructor(baseDir){

        super(baseDir);

        this.name = "Single Choice Button";
        this.description = "A simple button.";
        this.versionDescription = "Initial Version";
        this.scripts = ["widget/single-choice-button.js"];
        this.css = ["widget/single-choice-button.css"];
        this.assetDirectory= "";
        this.implementationClass  = "SingleChoiceButton";
        this.debugMode = false;
        this.inputTypes = [
            {
                "inputType": ioType.IOTypes.Word.className,
                "name": "Input word",
                "description": "A single word clicked by the user",
            },
            {
                "inputType": ioType.IOTypes.Paragraph.className,
                "name": "Input paragraph",
                "description": "A paragraph of text clicked by the user",
            }
        ];

    }

    getConfigurationSchema(){
        return {
            "type": "object",
            "properties": {
                "backgroundColorButtonActive": {
                    "type": "string",
                    "format": "color",
                    "default": "#ffffff",
                    "title": "Active button background color"
                }
            },
            "required": [
                "backgroundColorButtonActive"
            ]
        };
    }

}

module.exports.class = SingleChoiceButton;