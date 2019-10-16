var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class Personalization extends base.EngineBase {
    constructor() {
        super();
        this.id = "Personalization";
        this.name = "Athena UI Personalization";
        this.description = "Personalizes ui-elements on web-pages according to a profile";
        this.version = "1.0";
        this.debugMode = false;
        this.versionDescription = "Initial version";

    }


    getDataSchema() {
        return {
            "type": "object",
            "properties": {
                "language": {
                    "type": "string",
                    "title": "profile",
                    "description": "Your preferred profile template",
                    "default": "inPage- arasaac",
                    "enum": [
                        "inPage- bliss",
                        "inPage- arasaac",
                        "tooltip- bliss",
                        "tolltipp- arasaac"
                    ],
                }
            },
            "required": [
                "language"
            ]
        };
    }




    getFunctions() {
        return [
            {
                id: "personalization",
                name: "Personalize User Interface",
                description : "Personalizes ui-elements on web-pages according to a profile",
                defaultIcon : "assets/personalize.png",
                includeInDefaultProfile: false,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.LOCAL,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts: [
                    '/js/tools/templatesForFramework/InPageArasaacTemplate.js',
                    '/js/tools/firebase-app.js',
                    '/js/tools/firebase-database.js',
                    '/js/tools/FirebaseManager.js',
                    '/js/tools/templatesForFramework/InPageArasaacTemplate.js',
                    '/js/tools/templatesForFramework/InPageBlissTemplate.js',
                    '/js/tools/templatesForFramework/TooltipArasaacTemplate.js',
                    '/js/tools/templatesForFramework/TooltipBlissTemplate.js',
                    '/js/ps1_e.js'],
                styleSheets: [],
                entryPoint: "personalizeCurrentPage"
            }

        ];
    }
}

module.exports.class = Personalization;