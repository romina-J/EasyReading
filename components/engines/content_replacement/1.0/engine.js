var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");
let databaseManager = require("../../../../core/database/database-manager");
class Dictionary extends base.EngineBase {
    constructor() {
        super();
        this.id = "Content Replacement";
        this.name = "Content Replacement";
        this.description = "A simple online dictionary";
        this.version = "1.0";
        this.versionDescription = "Initial Version";
    }

    getDataSchema() {
        return {};
    }

    getFunctions() {
        return [
            {
                id: "content_replacement",
                name: "Content",
                description: "Content Replacement",
                defaultIcon: "assets/contentReplacement.png",
                includeInDefaultProfile: true,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.DICTIONARY,
                inputTypes: [{
                    "inputType": ioType.IOTypes.URLType.className,
                    "name": "Url",
                    "description": "Url of the page to search for replacements",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.ContentReplacement.className,
                    "name": "Content replacements",
                    "description": "Content replacements",

                }],
                entryPoint: "contentReplacement",
            }

        ];
    }
    async contentReplacement(callback, input, config,profile,constants) {


        let loadActiveDOMHelperRequest = databaseManager.createRequest("content_replacement").where("url", "LIKE", input.url+"%");
        let loadActiveDOMHelperResult = await databaseManager.executeRequest(loadActiveDOMHelperRequest);

        let result = new ioType.IOTypes.ContentReplacement();
        for(let i=0; i < loadActiveDOMHelperResult.result.length; i++){
            result.addReplacement("content_replacement",loadActiveDOMHelperResult.result[i]);
        }
        callback(result);

    }


}


module.exports.class = Dictionary;