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

        }catch (exeption){

            console.log(exeption);
            this.polly = null;
        }


    }


    getDataSchema() {
        return {};
    }

    getFunctions() {
        return [
            {
                id: "tts",
                name: "Text to Speech",
                description: "Converts text to Speech",
                defaultIcon: "assets/text-to-speech.png",
                type: base.EngineFunction.FuntionType.REMOTE,
                inputTypes: [{
                    "inputType": ioType.IOTypes.Paragraph.className,
                    "name": "Input paragraph",
                    "description": "Paragraph to translate",
                },
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

    convertTextToSpeech(webSocketConnection, req, config) {

        let voiceID = "Hans";
        if(req.input.lang === "en"){
            voiceID = "Brian";
        }else if(req.input.lang === "de"){
            voiceID = "Hans";
        }else if(req.input.lang === "sv"){
            voiceID = "Astrid";
        }
        let params = {
            'Text': req.input.value+"          ",
            'OutputFormat': 'mp3',
            'VoiceId': voiceID,
            'SampleRate': '22050',
            //  'SpeechMarkTypes':['word','sentence']
        };


        let polly = this.polly;
        const fs = require('fs-extra');
        let webPath = "tmp/"+webSocketConnection.profile.uuid+"/aws-polly-tts/";
        let tempDirPath = "./public/"+webPath;
        this.polly.synthesizeSpeech(params, (err, data) => {
            if (err) {
                console.log(err.code)
            } else if (data) {
                if (data.AudioStream instanceof Buffer) {

                    if (!fs.existsSync(tempDirPath)) {
                        fs.mkdirSync(tempDirPath);

                    }else{

                        try{
                            fs.emptyDirSync(tempDirPath);
                        }catch (error){
                            console.log(error);
                        }


                    }

                    const uuidV4 = require('uuid/v4');
                    let filename = uuidV4();

                    fs.writeFile(tempDirPath+filename+".mp3", data.AudioStream, function(err) {
                        if (err) {
                            return console.log(err)
                        }

                        params.OutputFormat = "json";
                        params.SpeechMarkTypes = ['word','sentence'];

                        polly.synthesizeSpeech(params, (err, data) => {
                            if (err) {
                                console.log(err.code)
                            } else if (data) {
                                if (data.AudioStream instanceof Buffer) {

                                    fs.writeFile(tempDirPath+filename+".json", data.AudioStream, function(err) {
                                        if (err) {
                                            return console.log(err)
                                        }

                                    });

                                    let speechMarksSource = data.AudioStream.toString().split("\n");

                                    let speechMarks = [];
                                    //Last line is blank in AWS Polly
                                    for(let i=0; i < speechMarksSource.length-1; i++){
                                        try{
                                            let currentSpeechMark = JSON.parse(speechMarksSource[i]);
                                            speechMarks.push(currentSpeechMark);
                                        }catch (error){

                                        }

                                    }

                                    let ioType = rootRequire("core/IOtypes/iotypes");
                                    let audioURL =  webSocketConnection.url+webPath+filename+".mp3";
                                    let speechMarkURL = webSocketConnection.url+webPath+filename+".json";

                                    req.result = new ioType.IOTypes.AudioType(audioURL, speechMarkURL,
                                        speechMarks);
                                    req.outputType = ioType.IOTypes.AudioType.className;
                                    req.type = "cloudRequestResult";
                                    webSocketConnection.sendMessage(req);
                                }
                            }
                        });
                    });
                }
            }
        });

    }


}


module.exports.class = AWSPollyTextToSpeech;