var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class Colorize extends base.EngineBase{
    constructor() {
        super();
        this.id = "Colorize";
        this.name = "Colorize";
        this.description = "Colorize the whole web-page according to your favorite color";
        this.version = "1.0";
        this.debugMode = false;
        this.versionDescription = "Initial version";

    }


    getDataSchema(){
        return {
            "type": "object",
            "properties": {
                "backgroundColor": {
                    "type": "string",
                    "format": "color",
                    "default": "#000000",
                },
                "fontColor": {
                    "type": "string",
                    "format": "color",
                    "default": "#FFFFFF"
                }
            },

            "required": [
                "backgroundColor",
                "fontColor"
            ]
        };
    }

    getFunctions(){
        return [
            {
                id : "colorize",
                name: "Colorize",
                description : "Colors a page according to your favorite color",
                defaultIcon : "assets/colorize.png",
                type: base.EngineFunction.FuntionType.LOCAL,
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType" : ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/colorize.js'],
                styleSheets : [],
                entryPoint: "colorize",
            }

        ];
    }
}

module.exports.class = Colorize;
