const base = rootRequire("core/components/engines/base/engine-base");
const ioType = rootRequire("core/IOtypes/iotypes");

class EasyReadingAAC extends base.EngineBase {

    constructor() {
        super();
        this.id = "EasyReadingAAC";
        this.name = "EasyReadingAAC";
        this.description = "Creates AAC Annotations";
        this.version = "1.0";
        this.versionDescription = "Initial Version";
    }

    getFunctions() {
        return [
            {
                id: "er_aac",
                name: "Easy Reading AAC",
                description: "Creates an AAC version",
                defaultIcon: "assets/er-aac-symbol.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en", "de", "sv"],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.DICTIONARY,
                supportCategories: [
                    base.functionSupportCategories.symbol_support.aac,
                ],
                inputTypes: [
                    {
                        "inputType": ioType.IOTypes.Paragraph.className,
                        "name": "Input paragraph",
                        "description": "Paragraph to detect key phrases",
                    }
                ],
                outputTypes: [
                    {
                        "outputType": ioType.IOTypes.Paragraph.className,
                        "name": "Paragraph word",
                        "description": "Translated paragraph",
                    }
                ],
                toolCategory: base.EngineFunction.ToolCategories.Explanation,
                entryPoint: "createAAC",
            },

        ];
    }

    async createAAC(callback, input, config, profile, constants) {
        let stem;
/*        if (input.lang === 'de') {
            const { StemmerDe } = require('@nlpjs/lang-de');
            stem = new StemmerDe();
        }*/
        const core = require("../../../../core/core");
        const keywordDetector = core.getEngine("aws-text-analysis");
        const picDictEngine = core.getEngine("arasaac-picture-dictionary");

        await keywordDetector.detectKeywords(
            function (result) {
                const noResults = new ioType.IOTypes.NoResult("No result found!");
                if (!('taggedText' in result) || !result.taggedText.length) {
                    callback(noResults);
                    return;
                }
                const noSearchTags = ['O', 'PART', 'SYM'];
                let runningRequests = 0;
                for (let i = 0; i < result.taggedText.length; i++) {
                    if (result.taggedText[i].token && result.taggedText[i].tags.includes('keyword')) {
                        let consider = true;
                        for (let j=0; j<noSearchTags.length; j++) {
                            if (result.taggedText[i].tags.indexOf(noSearchTags[j]) > -1) {
                                consider = false;
                                break;
                            }
                        }
                        if (consider) {
                            runningRequests++;
                        }
                    }
                }
                if (runningRequests === 0) {
                    callback(noResults);
                    return;
                }
                const noStemTags = ['PROPN', 'AUX', 'CONJ', 'CCONJ', 'PUNCT', 'SYM'];
                for (let i = 0; i < result.taggedText.length; i++) {
                    const text = result.taggedText[i];
                    let fetchPicture = false;
                    let token = text.token;
                    if (token && text.tags.includes('keyword')) {
                        // token = token.toLowerCase();
                        fetchPicture = true
                        for (let j=0; j<noSearchTags.length; j++) {
                            if (text.tags.indexOf(noSearchTags[j]) > -1) {
                                fetchPicture = false;
                                break;
                            }
                        }
                        if (fetchPicture && input.lang === 'de' && stem) {
                            let stemWord = true;
                            for (let j=0; j<noStemTags.length; j++) {
                                if (text.tags.indexOf(noStemTags[j]) > -1) {
                                    stemWord = false;
                                    break;
                                }
                            }
                            if (stemWord) {
                                token = stem.stemWord(token);
                            }
                        }
                    }
                    if (fetchPicture) {
                        const pictureCallback = pictureResult => {
                            runningRequests--;
                            if (pictureResult.name === "ImageIOType") {
                                result.taggedText[i].text = '<span style="display:inline-block; line-height:0.8; ">\n' +
                                    '    <span style="display:block;">\n' +
                                    '        <img src="' + pictureResult.url + '" alt="' + pictureResult.title +
                                    '" style="width: 50px; height: 50px;">\n' +
                                    '    </span>\n' +
                                    '    <span style="display:block; text-align:center">&nbsp;' + result.taggedText[i].text + '&nbsp;</span>\n' +
                                    '</span>';
                            } else if(pictureResult.name === "Error") {
                                callback(pictureResult);
                                return;
                            }
                            if (runningRequests === 0) {
                                let finalText = "";
                                for (let i = 0; i < result.taggedText.length; i++) {
                                    finalText += result.taggedText[i].text;
                                }
                                callback(new ioType.IOTypes.Paragraph(finalText));
                            }
                        };
                        picDictEngine.pictureDictionary(
                            pictureCallback,
                            new ioType.IOTypes.Word(token, input.lang, "", "", "", text.tags),
                            config,
                            profile,
                            constants
                        );
                    }
                }
            }, input, config, profile, constants
        );
    }

}

module.exports.class = EasyReadingAAC;
