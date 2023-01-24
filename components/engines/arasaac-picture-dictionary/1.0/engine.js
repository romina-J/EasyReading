let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class ArasaacPictureDictionary extends base.EngineBase {
    constructor() {
        super();
        this.name = "Arasaac Pictue Dictionary";
        this.description = "Arasaac Picture dictionary";
        this.versionDescription = "Initial Version";
    }

    getFunctions() {
        return [
            {
                id: "arasaac_picture_dictionary",
                name: "Arasaac Picture Dictionary",
                description: "Arasaac picture dictionary",
                defaultIcon: "assets/texthelp-picture-dictionary.png",
                includeInDefaultProfile: false,
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.text_support.multimedia_annotation,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.Word.className,
                    "name": "Input word",
                    "description": "Word to translate",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.ImageIOType.className,
                    "name": "Image",
                    "description": "Image word",

                }],
                supportedLanguages: ["en","sv","de"],
                toolCategory: base.EngineFunction.ToolCategories.Explanation,
                entryPoint: "pictureDictionary",
            }

        ];
    }

    pictureDictionary(callback, input, config, profile, constants) {
        let pictureDictionary = this;
        let core = require("../../../../core/core");
        let translate = core.getEngine("translate");
        translate.translateWord(
            function (result) {
                if (result.name === "Error") {
                    callback(result);
                } else {
                    pictureDictionary.createPictureRequest(callback, result, config, profile, constants);
                }
            }, input, config, profile, constants
        );
    }

    createPictureRequest(callback, input, config, profile, constants) {

        let keyword = input.word;
        keyword = encodeURIComponent(keyword);

        let options = {
            url: `https://api.arasaac.org/api/pictograms/${input.lang}/search/${keyword}`,
            method: 'GET',
        };
        let request = require('request');
        request(options, function (err, res, body) {
            try {
                let response = JSON.parse(body);
                if (Array.isArray(response)) {
                    if (response.length > 0) {
                        let imageId = response[0]._id;
                        let imageOptions = {
                            url: 'https://api.arasaac.org/api/pictograms/' + imageId + '?url=true&download=false',
                            method: 'GET',
                        };
                        request(imageOptions, function (err, res, body) {
                            try {
                                let imageResponse = JSON.parse(body);
                                let imageURL = imageResponse.image;
                                let result = new ioType.IOTypes.ImageIOType(imageURL, input.word, input.word);
                                callback(result);
                            } catch (error) {
                                callback(new ioType.IOTypes.Error("Error processing request"));
                            }
                        });
                    } else {
                        callback(new ioType.IOTypes.NoResult("No images found"));
                    }
                } else {
                    callback(new ioType.IOTypes.NoResult("No images found"));
                }
            } catch (err) {
                callback(new ioType.IOTypes.Error("Error processing request"));
                console.log(err);
            }
        });
    }
}

module.exports.class = ArasaacPictureDictionary;