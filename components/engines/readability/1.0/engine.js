var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class Readability extends base.EngineBase{
    constructor() {
        super();
        this.id = "Readability";
        this.name = "Readability";
        this.description = "Readability the whole web-page according to your favorite color";
        this.version = "1.0";
        this.debugMode = false;
        this.versionDescription = "Initial version";

    }


    getFunctions(){
        return [
            {
                id : "readability",
                name: "Readability",
                description : "Gets Main Content",
                defaultIcon : "assets/colorize.png",
                includeInDefaultProfile: false,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.LOCAL,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType" : ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/Readability.js','/js/Readability-readerable.js','/js/readabilityController.js'],
                styleSheets : ['/css/style.css'],
                entryPoint: "readability",
            }

        ];
    }

    getDataSchema() {
        return {
            "type": "object",
            "properties": {
                "contentWidth": {
                    "type": "integer",
                    "title": "Content width",
                    "description": "Max content width",
                    "default": 50,
                    "minimum": 30,
                    "maximum": 80,
                },
                "fontSize": {
                    "type": "integer",
                    "title": "Fon size",
                    "description": "Font size of the reading mode",
                    "default": 24,
                    "minimum": 15,
                    "maximum": 40,
                },
                "lineSpacing": {
                    "type": "number",
                    "title": "Line spacing",
                    "description": "The ",
                    "default": 2.5,
                    "minimum": 1,
                    "maximum": 4,
                }
            },
            "required": [
                "contentWidth",
                "gender",
                "languagePriority"

            ]
        };
    }
}

module.exports.class = Readability;
