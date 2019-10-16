let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class LineSpacingTool extends base.EngineBase{
    constructor() {
        super();
        this.name = "Line height increaser";
        this.description = "Tools that change font size, line spacing and so on...";
        this.version = "1.0";
        this.versionDescription = "Initial version";
        this.bundles = [new base.FunctionBundle('Line Spacing', 'Alter the spacing between lines in the current page.')]
    }

    getFunctions(){
        return [
            {
                id : "increaseLineHeight",
                sortOrder: "2",
                name: "Line spacing tool",
                description : "Increases or decreases line spacing",
                defaultIcon : "assets/increaseLineHeight.png",
                includeInDefaultProfile: false,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.LOCAL,
                category: base.EngineFunction.FunctionCategory.SPEECH_SYNTHESIS,
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/line-spacing-tool.js'],
                styleSheets : [],
                entryPoint: "increaseLineHeight",
                bundle: this.bundles[0],
            },
            {
                id : "decreaseLineHeight",
                sortOrder: "2",
                name: "Decrease line height",
                description : "Decreases the line height",
                defaultIcon : "assets/decreaseLineHeight.png",
                includeInDefaultProfile: false,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.LOCAL,
                category: base.EngineFunction.FunctionCategory.SPEECH_SYNTHESIS,
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/line-spacing-tool.js'],
                styleSheets : [],
                entryPoint: "decreaseLineHeight",
                bundle: this.bundles[0],
            }

        ];
    }
}

module.exports.class = LineSpacingTool;