let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class TextHelp extends base.EngineBase {
    constructor() {
        super();
        this.name = "Texthelp";
        this.description = "Texthelp Services";
        this.versionDescription = "Initial Version";

        this.token = null;
        this.tokenExpiryDate = null;
        this.refresh_token = null;

        this.ttsVoices = {
            en: "Tom",
            de: "Petra",
            es: "Monica",
            default: "Petra",

        };

        this.allTTSVoices = [
            {
                "voice": "Ava",
                "description": "US Ava - Vocalizer"
            },
            {
                "voice": "Samantha",
                "description": "US Samantha - Vocalizer"
            },
            {
                "voice": "Tom",
                "description": "US Tom - Vocalizer"
            },
            {
                "voice": "Serena",
                "description": "UK Serena - Vocalizer"
            },
            {
                "voice": "Daniel",
                "description": "UK Daniel - Vocalizer"
            },
            {
                "voice": "Fiona",
                "description": "UK Scottish Fiona - Vocalizer"
            },
            {
                "voice": "Paulina",
                "description": "Mexican Spanish Paulina - Vocalizer"
            },
            {
                "voice": "Monica",
                "description": "Spanish Monica - Vocalizer"
            },
            {
                "voice": "Carlos",
                "description": "Columbian Spanish Carlos - Vocalizer"
            },
            {
                "voice": "Miren",
                "description": "Basque Miren - Vocalizer"
            },
            {
                "voice": "Montserrat",
                "description": "Catalan Montserrat - Vocalizer"
            },
            {
                "voice": "Amelie",
                "description": "French Canadian Amelie - Vocalizer"
            },
            {
                "voice": "Audrey",
                "description": "French Audrey - Vocalizer"
            },
            {
                "voice": "Karen",
                "description": "Australian Karen - Vocalizer"
            },
            {
                "voice": "Lee",
                "description": "Australian Lee - Vocalizer"
            },
            {
                "voice": "Luciana",
                "description": "Brazilian Luciana - Vocalizer"
            },
            {
                "voice": "Claire",
                "description": "Dutch Claire - Vocalizer"
            },
            {
                "voice": "Ellen",
                "description": "Flemish Ellen - Vocalizer"
            },
            {
                "voice": "Petra",
                "description": "German Petra - Vocalizer"
            },
            {
                "voice": "Alice",
                "description": "Italian Alice - Vocalizer"
            },
            {
                "voice": "Luciana",
                "description": "Portuguese Luciana - Vocalizer"
            },
            {
                "voice": "Felipe",
                "description": "Portuguese Felipe - Vocalizer"
            },
            {
                "voice": "Alva",
                "description": "Swedish Alva - Vocalizer"
            },
            {
                "voice": "Henrik",
                "description": "Norwegian Henrik - Vocalizer"
            },
            {
                "voice": "Nora",
                "description": "Norwegian Nora - Vocalizer"
            },
            {
                "voice": "Satu",
                "description": "Finnish Satu - Vocalizer"
            },
            {
                "voice": "Damayanti",
                "description": "Indonesian Damayanti - Vocalizer"
            },
            {
                "voice": "Ewa",
                "description": "Polish Ewa - Vocalizer"
            },
            {
                "voice": "Tarik",
                "description": "Arabic Tarik - Vocalizer"
            },
            {
                "voice": "Tian-Tian",
                "description": "Mandarin Tian-tian - Vocalizer"
            },
            {
                "voice": "Milena",
                "description": "Russian Milena - Vocalizer"
            },
            {
                "voice": "Yuri",
                "description": "Russian Yuri - Vocalizer"
            },
            {
                "voice": "Veena",
                "description": "Indian English Veena - Vocalizer"
            }
        ];

        this.dictionaryLanguages = {
            "en_US": "American English",
            "en_GB": "British English",
            "pt": "Portuguese",
            "es": "Spanish",
            "cs": "Czech",
            "nl": "Dutch",
            "fr": "French",
            "el": "Greek",
            "it": "Italian",
            "pl": "Polish",
            "ar": "Arabic"
        }
    }

    getCredentials() {
        if (process.env.TEXTHELP_USER && process.env.TEXTHELP_PW) {

            return {
                client_id: process.env.TEXTHELP_USER,
                client_secret: process.env.TEXTHELP_PW,
            }
        }

        if (this.credentialManager.hasKey("TEXTHELP_USER") && this.credentialManager.hasKey("TEXTHELP_PW")) {

            return {
                client_id: this.credentialManager.getValueForKey("TEXTHELP_USER"),
                client_secret: this.credentialManager.getValueForKey("TEXTHELP_PW"),
            }
        }

        return {};


    }

    getToken(callback) {

        //Refresh token 10 minutes earlier
        if (this.tokenExpiryDate > Date.now() + 600000) {

            callback(null, this.token);
            return;


        }

        let request = require('request');
        let engine = this;

        if (this.refresh_token) {

            let options = {
                method: 'POST',
                url: 'https://easy-reading-api.dev.texthelp.com/api/auth/refresh',
                json: {refresh_token: this.refresh_token},
            };

            request(options, function (err, res, body) {
                if (err) {
                    console.log(err);
                    engine.token = null;
                    engine.tokenExpiryDate = null;
                    engine.refresh_token = null;
                    callback(err);
                    return;
                }

                try {

                    if (body.status === "success") {
                        engine.token = body.data.token;
                        engine.tokenExpiryDate = body.data.expires;
                        callback(null, engine.token);
                    } else {

                        console.log(body.data.message);
                    }


                } catch (err) {
                    console.log(err);
                    engine.token = null;
                    engine.times = null;
                    callback(err);
                }
            });
        } else {

            let options = {
                method: 'POST',
                url: 'https://easy-reading-api.dev.texthelp.com/api/auth/generate',
                json: this.getCredentials(),
                //   auth: this.getCredentials(),
            };


            request(options, function (err, res, body) {
                if (err) {
                    console.log(err);
                    engine.token = null;
                    engine.tokenExpiryDate = null;
                    callback(err);
                    return;
                }

                try {

                    if (body.status === "success") {
                        engine.token = body.data.token;
                        engine.tokenExpiryDate = body.data.expires;
                        engine.refresh_token = body.data.refresh_token;
                        callback(null, engine.token);
                    } else {

                        console.log(body.data.message);
                    }


                } catch (err) {
                    console.log(err);
                    engine.token = null;
                    engine.times = null;
                    callback(err);
                }
            });
        }


    }


    getDataSchema() {
        return {};
    }

    getFunctions() {
        return [
            {
                id: "sampleJavaScriptInjection",
                name: "Texthelp JavaScript Injection",
                description: "Sample Javascript",
                defaultIcon: "assets/texthelp-js.png",
                type: base.EngineFunction.FuntionType.REMOTE,
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.JavaScriptType.className,
                    "name": "Output",
                    "description": "Javascript to call",

                }],
                entryPoint: "getScript",
            },
            {
                id: "ageOfAcquisition",
                name: "Age of Acquisition",
                description: "Texthelp Age of Acquisition",
                defaultIcon: "assets/texthelp-age.png",
                type: base.EngineFunction.FuntionType.REMOTE,
                inputTypes: [{
                    "inputType": ioType.IOTypes.Paragraph.className,
                    "name": "Paragraph",
                    "description": "Words or paragraphs",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.Word.className,
                    "name": "averageAgeOfAquisition",
                    "description": "average age of Aquisition",

                }],
                entryPoint: "averageAgeOfAquisition",
            },
            {
                id: "th_tts",
                name: "Text to Speech",
                description: "Converts text to Speech",
                defaultIcon: "assets/texthelp-tts.png",
                type: base.EngineFunction.FuntionType.REMOTE,
                inputTypes: [{
                    "inputType": ioType.IOTypes.Paragraph.className,
                    "name": "Input word",
                    "description": "Word to translate",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.AudioType.className,
                    "name": "Output",
                    "description": "Image word",

                }],
                entryPoint: "textToSpeech",
            },
            {
                id: "picture_dictionary",
                name: "Picture Dictionary",
                description: "Texthelp picture dictionary",
                defaultIcon: "assets/texthelp-picture-dictionary.png",
                type: base.EngineFunction.FuntionType.REMOTE,
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
                entryPoint: "picturedDictionary",
            }

        ];
    }

    getScript(webSocketConnection, req, config) {

        this.getToken(function (error, token) {

            if (error) {

                console.log(error);

            } else {
                let options = {
                    url: 'https://easy-reading-api.dev.texthelp.com/api/v1/test/script',
                    method: 'GET',
                    headers: {
                        Authorization: ' Bearer ' + token,
                    },
                };
                let request = require('request');
                request(options, function (err, res, body) {

                    try {
                        let response = JSON.parse(body);
                        if (response.status === "success") {
                            req.result = response.data.script;
                            req.type = "cloudRequestResult";
                            req.outputType = ioType.IOTypes.JavaScriptType.className;
                            webSocketConnection.sendMessage(req);
                        }
                    } catch (err) {
                        console.log(err);
                    }

                });
            }
        });
    }

    averageAgeOfAquisition(webSocketConnection, req, config) {
        this.getToken(function (error, token) {

            if (error) {

                console.log(error);

            } else {
                let options = {
                    url: 'https://easy-reading-api.dev.texthelp.com/api/v1/ageofacquisition',
                    method: 'POST',
                    headers: {
                        Authorization: ' Bearer ' + token,
                    },
                    json: {
                        content: req.input.value,
                    }
                };
                let request = require('request');
                request(options, function (err, res, body) {
                    try {
                        //    let response = JSON.parse(body);
                        let output = "";
                        if (body.status === "success") {
                            output = "Average age of acquisition: " + body.data.average;
                        } else {
                            output = "Could not connect to service. Please try again later.";
                        }
                        req.result = new ioType.IOTypes.Word(output);
                        req.type = "cloudRequestResult";
                        req.outputType = ioType.IOTypes.Word.className;
                        webSocketConnection.sendMessage(req);
                    } catch (err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    textToSpeech(webSocketConnection, req, config) {

        let voice = this.ttsVoices.default;
        if (typeof this.ttsVoices[req.input.lang] !== "undefined") {
            voice = this.ttsVoices[req.input.lang];
        }


        this.getToken(function (error, token) {


            if (error) {

                console.log(error);

            } else {

                //Create text with TH bookmarks
                let Tokenizer = require('sentence-tokenizer');
                let myTokenizer = new Tokenizer('Chuck');
                myTokenizer.setEntry(req.input.value);

                let sentences = myTokenizer.getSentences();
                let sentenceMap = [];
                let words = [];
                let wordMap = [];
                let text = "";
                let count = 0;
                for (let i = 0; i < sentences.length; i++) {
                    let wordTokens = myTokenizer.getTokens(i);
                    for (let j = 0; j < wordTokens.length; j++) {
                        text += " " + wordTokens[j] + '<bookmark mark="' + count + '"/>';
                        words.push(wordTokens[j]);
                        wordMap.push(count);
                        count++;
                    }


                    text += '<bookmark mark="' + count + '"/>';
                    sentenceMap.push(count);
                    count++;
                }
                //insert some space
                text += "   ";


                let options = {
                    url: 'https://easy-reading-api.dev.texthelp.com/api/v1/speech/speak',
                    method: 'POST',
                    headers: {
                        Authorization: ' Bearer ' + token,
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF8"
                    },

                    form: {
                        text: encodeURI(text),
                        voice: voice,
                    },
                    encoding: null,
                };

                let request = require('request');
                request(options, function (err, res, body) {

                    try {


                        let length = res.headers['th-time'];
                        let buf = body.slice(0, length);
                        let json = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(buf)));

                        let currentWordStartTime = 0;
                        let currentSentenceStartTime = 0;

                        //AWS Style speechmarks might not be needed. But just in case
                        let speechMarksAWSStyle = "";
                        let speechMarks = [];
                        if (json.bookmarks) {
                            for (let i = 0; i < json.bookmarks.length; i++) {
                                if (wordMap.indexOf(i) !== -1) {
                                    speechMarksAWSStyle += '{"time":' + currentWordStartTime + ',"type":"word","value":"' + words[wordMap.indexOf(i)] + '"}\n';

                                    speechMarks.push({
                                        "time": currentWordStartTime,
                                        "type": "word",
                                        "value": words[wordMap.indexOf(i)],
                                    });
                                    currentWordStartTime = Math.round(json.bookmarks[i].time);
                                } else {
                                    speechMarksAWSStyle += '{"time":' + currentSentenceStartTime + ',"type":"sentence","value":"' + sentences[sentenceMap.indexOf(i)] + '"}\n';
                                    speechMarks.push({
                                        "time": currentSentenceStartTime,
                                        "type": "sentence",
                                        "value": sentences[sentenceMap.indexOf(i)],
                                    });
                                    currentSentenceStartTime = Math.round(json.bookmarks[i].time);
                                }
                            }
                        }
                        const fs = require('fs-extra');
                        let webPath = "tmp/" + webSocketConnection.profile.uuid + "/th-tts/";
                        let tempDirPath = "./public/" + webPath;
                        if (!fs.existsSync(tempDirPath)) {
                            fs.mkdirSync(tempDirPath);
                        } else {
                            fs.emptyDirSync(tempDirPath);
                        }
                        const uuidV4 = require('uuid/v4');
                        let filename = uuidV4();
                        fs.writeFile(tempDirPath + filename + ".mp3", Buffer.from(new Uint8Array(body.slice(length))), function (err) {
                            if (err) {
                                return console.log(err)
                            }

                        });
                        fs.writeFile(tempDirPath + filename + ".json", speechMarksAWSStyle, function (err) {
                            if (err) {
                                return console.log(err)
                            }
                        });
                        req.result = new ioType.IOTypes.AudioType(
                            webSocketConnection.url + webPath + filename + ".mp3",
                            webSocketConnection.url + webPath + filename + ".json",
                            speechMarks);
                        req.outputType = ioType.IOTypes.AudioType.className;
                        req.type = "cloudRequestResult";
                        webSocketConnection.sendMessage(req);
                    } catch (err) {
                        console.log(err);
                    }
                });
            }
        });


    }

    picturedDictionary(webSocketConnection, req, config) {
        this.getToken(function (error, token) {
            if (error) {
                console.log(error);
            } else {
                let options = {
                    url: 'https://easy-reading-api.dev.texthelp.com//api/v1/picturedictionary/get',
                    method: 'POST',
                    headers: {
                        Authorization: ' Bearer ' + token,
                    },
                    json: {
                         text: req.input.value,
                    }
                };
                let request = require('request');
                request(options, function (err, res, body) {
                    try {
                        let src = "";
                        if(body.symbols.length !== 0){
                            src = body.symbols[0];
                        }
                        req.result = new ioType.IOTypes.ImageIOType(src, body.word, body.word);
                        req.outputType = ioType.IOTypes.ImageIOType.className;
                        req.type = "cloudRequestResult";
                        webSocketConnection.sendMessage(req);
                    } catch (err) {
                        console.log(err);
                    }
                });
            }
        });
    }
}

module.exports.class = TextHelp;