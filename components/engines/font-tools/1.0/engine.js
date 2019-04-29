let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class FontTools extends base.EngineBase{
    constructor() {
        super();
        this.name = "Font tools";
        this.description = "Tools that change font size, line spacing and so on...";
        this.version = "1.0";
        this.versionDescription = "Initial version";

    }

    getFunctions(){
        return [
            {
                id : "magnifyFont",
                name: "Magnify font",
                description : "Magnifies the font size",
                defaultIcon : "assets/magnify.png",
                type: base.EngineFunction.FuntionType.LOCAL,
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType" : ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/font-tools.js'],
                styleSheets : [],
                entryPoint: "magnifyFont",
            },
            {
                id : "shrinkFont",
                name: "Shrink font",
                description : "Shrinks the font size",
                defaultIcon : "assets/shrink.png",
                type: base.EngineFunction.FuntionType.LOCAL,
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/font-tools.js'],
                styleSheets : [],
                entryPoint: "shrinkFont",
            },
            {
                id : "increaseLineHeight",
                name: "Increase line height",
                description : "Increases the line height",
                defaultIcon : "assets/increaseLineHeight.png",
                type: base.EngineFunction.FuntionType.LOCAL,
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/font-tools.js'],
                styleSheets : [],
                entryPoint: "increaseLineHeight",
            },

            {
                id : "decreaseLineHeight",
                name: "Decrease line height",
                description : "Decreases the line height",
                defaultIcon : "assets/decreaseLineHeight.png",
                type: base.EngineFunction.FuntionType.LOCAL,
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/font-tools.js'],
                styleSheets : [],
                entryPoint: "decreaseLineHeight",
            }

        ];
    }
}

module.exports.class = FontTools;