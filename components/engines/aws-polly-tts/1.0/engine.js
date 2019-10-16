let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class AWSPollyTextToSpeech extends base.EngineBase {
    constructor() {
        super();
        this.name = "AWS Polly TTS";
        this.description = "A text to speech engine hosted on AWS";
        this.versionDescription = "Initial Version";

        this.polly = null;
        this.initPolly();

    }

    initPolly() {

        try {

            const AWS = require('aws-sdk');
            const Fs = require('fs');

            this.polly = new AWS.Polly({
                signatureVersion: 'v4',
                region: 'eu-central-1'
            });

        } catch (exeption) {

            console.log(exeption);
            this.polly = null;
        }


    }

    getConfigurationDataOptions() {
        return [{
            type: "singleSelectList",
            dataSchemaProerty: ["language"],
            configurableDataOption: [
                {"label": "English", "value": "en"},
                {"label": "French", "value": "fr"},
                {"label": "German", "value": "de"},
                {"label": "Spanish", "value": "es"},
                {"label": "Swedish", "value": "se"}
            ]
        },
            {
                type: "singleSelectList",
                dataSchemaProerty: ["gender"],
                configurableDataOption: [
                    {"label": "Male", "value": "male"},
                    {"label": "Female", "value": "female"},
                ]
            }, {
                type: "singleSelectList",
                dataSchemaProerty: ["languagePriority"],
                configurableDataOption: [
                    {"label": "Yes", "value": true},
                    {"label": "No", "value": false},
                ]
            }

        ]
    }


    getDataSchema() {
        return {
            "type": "object",
            "properties": {
                "language": {
                    "type": "string",
                    "title": "Language",
                    "description": "Your preferred language",
                    "default": "en",
                    "enum": [
                        "en",
                        "de",
                        "es",
                        "fr",
                        "se",
                    ],
                },
                "gender": {
                    "type": "string",
                    "title": "Language",
                    "description": "Preferred gender of the language",
                    "default": "female",
                    "enum": [
                        "male",
                        "female",
                    ],
                },

                "languagePriority": {
                    "type": "boolean",
                    "title": "Language priority",
                    "description": "Use your speech even on sites that have a different language",
                    "default": false,
                }

            },
            "required": [
                "language",
                "gender",
                "languagePriority"

            ]
        };
    }

    getFunctions() {
        return [
            {
                id: "tts",
                name: "AWS: Polly",
                description: "Converts text to Speech",
                defaultIcon: "assets/text-to-speech.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en","de","sv"],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.SPEECH_SYNTHESIS,
                inputTypes: [
                    {
                        "inputType": ioType.IOTypes.Paragraph.className,
                        "name": "Input paragraph",
                        "description": "Paragraph to convert to audio",
                    },
                    {
                        "inputType": ioType.IOTypes.Word.className,
                        "name": "Input word",
                        "description": "Word to convert to audio",
                    }

                ],
                outputTypes: [{
                    "outputType": ioType.IOTypes.AudioType.className,
                    "name": "Output",
                    "description": "Image word",

                }],
                entryPoint: "convertTextToSpeech",
            }
        ];
    }

    convertTextToSpeech(callback, input, config, profile, constants) {

        /*
        let voiceID = "Hans";
        if (input.lang === "en") {
            voiceID = "Brian";
        } else if (input.lang === "de") {
            voiceID = "Hans";
        } else if (input.lang === "sv") {
            voiceID = "Astrid";
        }*/
        let voiceID = this.getVoiceID(config,input.lang);

        let test = this.getVoiceID(config, input.lang);


        let params = {

            'OutputFormat': 'mp3',
            'VoiceId': voiceID,
            'SampleRate': '22050',
            //  'SpeechMarkTypes':['word','sentence']
        };

        if (input.name === "Paragraph") {
            params.Text = input.paragraph + "          ";
        } else if (input.name === "Word") {
            params.Text = input.word;
        }

        let ioType = rootRequire("core/IOtypes/iotypes");
        let polly = this.polly;
        const fs = require('fs-extra');
        let webPath = "tmp/" + profile.uuid + "/aws-polly-tts/";
        let tempDirPath = "./public/" + webPath;
        this.polly.synthesizeSpeech(params, (err, data) => {
            if (err) {

                //Error:
                callback(new ioType.IOTypes.Error("Error synthesize speech"));

                console.log(err.code)
            } else if (data) {
                if (data.AudioStream instanceof Buffer) {

                    if (!fs.existsSync(tempDirPath)) {
                        fs.mkdirSync(tempDirPath);

                    } else {

                        try {
                            fs.emptyDirSync(tempDirPath);
                        } catch (error) {
                            //Error:
                            callback(new ioType.IOTypes.Error("Error writing data"));
                            console.log(error);
                        }


                    }

                    const uuidV4 = require('uuid/v4');
                    let filename = uuidV4();

                    fs.writeFile(tempDirPath + filename + ".mp3", data.AudioStream, function (err) {
                        if (err) {
                            //Error:
                            callback(new ioType.IOTypes.Error("Error writing data"));
                        }

                        params.OutputFormat = "json";
                        params.SpeechMarkTypes = ['word', 'sentence'];

                        polly.synthesizeSpeech(params, (err, data) => {
                            if (err) {
                                console.log(err.code)
                            } else if (data) {
                                if (data.AudioStream instanceof Buffer) {

                                    fs.writeFile(tempDirPath + filename + ".json", data.AudioStream, function (err) {
                                        if (err) {
                                            //Error:
                                            callback(new ioType.IOTypes.Error("Error writing json"));
                                        }

                                    });

                                    let speechMarksSource = data.AudioStream.toString().split("\n");

                                    let speechMarks = [];
                                    //Last line is blank in AWS Polly
                                    for (let i = 0; i < speechMarksSource.length - 1; i++) {
                                        try {
                                            let currentSpeechMark = JSON.parse(speechMarksSource[i]);
                                            speechMarks.push(currentSpeechMark);
                                        } catch (error) {
                                            //Error:
                                            callback(new ioType.IOTypes.Error("Error writing speech marks"));
                                        }

                                    }


                                    let audioURL = constants.url + webPath + filename + ".mp3";
                                    let speechMarkURL = constants.url + webPath + filename + ".json";

                                    let result = new ioType.IOTypes.AudioType(audioURL, speechMarkURL,
                                        speechMarks);

                                    callback(result);
                                }
                            }
                        });
                    });
                }
            }
        });

    }


    getVoiceID(config, websiteLanguage) {

        let languageToUse = websiteLanguage;

        if (config.languagePriority === "true") {
            languageToUse = config.language;
        }

        switch (languageToUse) {
            case "sv":
                return "Astrid";
            case "it":

                if (config.gender === "female") {
                    return "Bianca";
                } else {
                    return "Giorgio";
                }

                break;
            case "fr":

                if (config.gender === "female") {
                    return "Lea";
                } else {
                    return "Mathieu";
                }

                break;
            case "de":

                if (config.gender === "female") {
                    return "Marlene";
                } else {
                    return "Hans";
                }

                break;
            case "en":

                if (config.gender === "female") {
                    return "Emma";
                } else {
                    return "Brian";
                }

                break;
            default:
                if (config.gender === "female") {
                    return "Emma";
                } else {
                    return "Brian";
                }
        }

    }


}


module.exports.class = AWSPollyTextToSpeech;