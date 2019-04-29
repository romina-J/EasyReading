var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class Personalization extends base.EngineBase{
    constructor() {
        super();
        this.id = "Personalization";
        this.name = "Athena UI Personalization";
        this.description = "Personalizes ui-elements on web-pages according to a profile";
        this.version = "1.0";
        this.debugMode = false;
        this.versionDescription = "Initial version";

    }


    getDataSchema(){
        return {

        };
    }

    getFunctions(){
        return [
            {
                id : "personalization",
                name: "Personalize User Interface",
                description : "Personalizes ui-elements on web-pages according to a profile",
                defaultIcon : "assets/personalize.png",
                type: base.EngineFunction.FuntionType.LOCAL,
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType" : ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/ps1_e.js'],
                styleSheets : [],
                entryPoint: "personalizeCurrentPage",
            }

        ];
    }
}

module.exports.class = Personalization;