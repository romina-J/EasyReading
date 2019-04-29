let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class AWSTextAnalysis extends base.EngineBase {
    constructor() {
        super();
        this.id = "aws-text-analysis";
        this.name = "Text Analysis";
        this.description = "AWS NLP Utilities";
        this.version = "1.0";
        this.versionDescription = "Initial Version";
        this.comprehend = null;
        this.initComprehend();
    }

    initComprehend() {
        try {
            const AWS = require('aws-sdk');
            this.comprehend = new AWS.Comprehend({
                region :'eu-west-1'
            });
        } catch (exception) {
            console.log(exeption);
            this.comprehend = null;
        }
    }

    getDataSchema() {
        return {};
    }

    getFunctions() {
        return [
            {
                id: "pos-tagger",
                name: "PoS Tagger",
                description: "A simple part-of-speech tagger",
                defaultIcon: "assets/pos.png",
                type: base.EngineFunction.FuntionType.REMOTE,
                inputTypes: [{
                    "inputType": ioType.IOTypes.Paragraph.className,
                    "name": "Input paragraph",
                    "description": "Paragraph to process",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.ParsedLanguageType.className,
                    "name": "Output paragraph",
                    "description": "Processed paragraph",

                }],
                entryPoint: "getPosTags",
            }

        ];
    }

    getSentences(paragraph) {
        let Tokenizer = require('sentence-tokenizer');
        let myTokenizer = new Tokenizer('Chuck');
        myTokenizer.setEntry(paragraph);
        return myTokenizer.getSentences();
    }

    /**
     * Return Part-of-Speech Tags of each word in a paragraph
     * @param webSocketConnection
     * @param req
     * @param config
     */
    getPosTags(webSocketConnection, req, config) {
        let engine = this;
        let sentences = this.getSentences(req.input.value);
        sentences.forEach((sentence) => {
            let params = {
                LanguageCode: 'en',
                Text: sentence,
            };
            this.comprehend.detectSyntax(params, function(err, data) {
                if (err) {
                    console.log(err);
                    callback(err);
                }
                else if ('SyntaxTokens' in data) {
                    let t_open = '<span class="easy-reading-highlight">(';
                    let t_close = ')</span> ';
                    let new_paragraph = '';
                    for(let i=0; i < data.SyntaxTokens.length; i++) {
                        new_paragraph += data.SyntaxTokens[i].Text + t_open + data.SyntaxTokens[i].PartOfSpeech.Tag + t_close;
                    }
                    req.result = new ioType.IOTypes.Paragraph(new_paragraph);
                    req.outputType = ioType.IOTypes.Paragraph.className;
                    req.type = "cloudRequestResult";
                    webSocketConnection.sendMessage(req);
                } else {
                    console.log('getPosTags: SyntaxTokens attribute not found in request');
                }
            });
        });
    }

    getSynonyms(webSocketConnection, req, config) {


        let request = require('request');
        let engine = this;

        let sentences = this.getSentences(req.input.value);
        for (let i=0; i < sentences.length; i++) {
            let options = {
                method: 'POST',
                url: 'http://nlp.easyreading.eu/api/v1/parse/pos',
                json: {
                    sentence: sentences[i],
                    pos_tag: 'noun',
                },
            };

            request(options, function (err, res, body) {
                if (err) {
                    console.log(err);
                    callback(err);
                    return;
                }

                try {

                    if (body.status === "success") {

                        callback(null);
                    } else {
                        console.log(body.data.message);
                    }


                } catch (err) {
                    console.log(err);
                    callback(err);
                }
            });

        }

    }


}


module.exports.class = AWSTextAnalysis;