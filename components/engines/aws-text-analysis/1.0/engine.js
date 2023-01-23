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
                name: "AWS PoS Tagger",
                description: "A simple part-of-speech tagger",
                defaultIcon: "assets/pos.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en","de","sv"],
                visibleInConfiguration: false,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.NLP,
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
                toolCategory: base.EngineFunction.ToolCategories.Other,
                entryPoint: "getPosTags",
            },
            {
                id: "aws-keyword",
                name: "Keyword detector",
                description: "Detects keywords found in the text",
                defaultIcon: "assets/key.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en","de","sv"],
                visibleInConfiguration: false,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.NLP,
                inputTypes: [{
                    "inputType": ioType.IOTypes.Paragraph.className,
                    "name": "Input paragraph",
                    "description": "Paragraph to process",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.ParsedLanguageType.className,
                    "name": "Output paragraph",
                    "description": "Keywords found in input paragraph",
                }],
                toolCategory: base.EngineFunction.ToolCategories.Other,
                entryPoint: "detectKeywords",
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
    getPosTags(callback, input, config, profile, constants) {
        let engine = this;
        let sentences = this.getSentences(input.paragraph);
        let parsed_sentences_buffer = {};
        sentences.forEach((sentence, i) => {
            let params = {
                LanguageCode: input.lang,
                Text: sentence,
            };
            this.comprehend.detectSyntax(params, function(err, data) {
                if (err) {
                    //Error:
                    callback(new ioType.IOTypes.Error("Error comprehend"));
                    console.log(err);
                }
                else if ('SyntaxTokens' in data) {
                    let t_open = '<span class="easy-reading-highlight">(';
                    let t_close = ')</span> ';
                    let new_paragraph = '';
                    for(let i=0; i < data.SyntaxTokens.length; i++) {
                        new_paragraph += data.SyntaxTokens[i].Text + t_open + data.SyntaxTokens[i].PartOfSpeech.Tag + t_close;
                    }
                    parsed_sentences_buffer[i] = new_paragraph;
                    if(Object.keys(parsed_sentences_buffer).length === sentences.length) {
                        let parsed_paragraph = '';
                        Object.keys(parsed_sentences_buffer).sort().forEach(function(j) {
                            parsed_paragraph += parsed_sentences_buffer[j];
                        });

                        let result = new ioType.IOTypes.Paragraph(new_paragraph);
                        callback(result);
                    }
                } else {
                    console.log('getPosTags: SyntaxTokens attribute not found in request');
                    //Error:
                    callback(new ioType.IOTypes.Error("SyntaxTokens attribute not found in request"));
                }
            });
        });
    }

    /**
     * Utility method for getting the PoS tags of the sentences of a given paragraph
     * @param paragraph string: input paragraph
     * @param lang string: language code for the input paragraph
     * @param preserveWhitespace boolean: whether returned tokens keep any trailing whitespace
     */
    async getSentencesWithTags(paragraph, lang, preserveWhitespace=false, callback) {
        if (!lang) {
            lang = 'en';
            console.log('getSentencesWithTags: no language given, defaulting to en.')
        }
        let sentences = this.getSentences(paragraph);
        let syntaxTokens = {};
        let parsed_sentences = {
            'original_paragraph': paragraph,
            'lang': lang,
            'parsed_sentences': []
        };
        let n_processed = 0;
        let parsed_data = {};
        for (let i=0; i<sentences.length; i++) {
            parsed_data[i] = {};
            parsed_data[i]['sentence'] = sentences[i];
        }
        for (const sentence of sentences) {
            const i = sentences.indexOf(sentence);
            let params = {
                LanguageCode: lang,
                Text: sentence,
            };
            try {
                this.comprehend.detectSyntax(params, function (err, data) {
                    if (data && 'SyntaxTokens' in data) {
                        syntaxTokens[i] = data.SyntaxTokens;
                        n_processed ++;
                        if (n_processed === sentences.length) {
                            let sentenceBeginOffset = 0;
                            for (let s=0; s<sentences.length; s++) {
                                parsed_data[s]['tokens'] = [];
                                for (let j=0; j<syntaxTokens[s].length; j++) {
                                    let tokenBeginOffset = sentenceBeginOffset + syntaxTokens[s][j].BeginOffset;
                                    let tokenEndOffset = sentenceBeginOffset + syntaxTokens[s][j].EndOffset;
                                    let whitespace = "";
                                    if (preserveWhitespace) {
                                        let k = -1;
                                        while (tokenBeginOffset+k+1 < paragraph.length) {
                                            k++;
                                            if (syntaxTokens[s][j].Text[k] === paragraph[tokenBeginOffset+k]) {
                                                continue;
                                            }
                                            if (j === syntaxTokens[s].length - 1) {
                                                while (paragraph[tokenBeginOffset+k].trim() === "") {
                                                    whitespace += paragraph[tokenBeginOffset+k];
                                                    k++;
                                                }
                                                break;
                                            }
                                            if (paragraph[tokenBeginOffset+k] !== syntaxTokens[s][j+1].Text[0]) {
                                                whitespace += paragraph[tokenBeginOffset+k];
                                            } else {
                                                break;
                                            }
                                        }
                                    }
                                    parsed_data[s]['tokens'].push({
                                        'token': syntaxTokens[s][j].Text,
                                        'text': syntaxTokens[s][j].Text + whitespace,
                                        'posTag': syntaxTokens[s][j].PartOfSpeech.Tag,
                                        'BeginOffset': tokenBeginOffset,
                                        'EndOffset': tokenEndOffset
                                    })
                                    // Add start and end offsets of sentence within paragraph
                                    if (j === syntaxTokens[s].length - 1) {
                                        parsed_data[s]['BeginOffset'] = sentenceBeginOffset;
                                        parsed_data[s]['EndOffset'] = sentenceBeginOffset + syntaxTokens[s][j].EndOffset;
                                        sentenceBeginOffset += syntaxTokens[s][j].EndOffset + 1;
                                    }
                                }
                            }
                            parsed_sentences['parsed_sentences'] = parsed_data;
                            callback(parsed_sentences);
                        }
                    }
                });
            } catch (error) {
                console.log(error);
                callback(new ioType.IOTypes.Error(error));
            }
        }
    }

    /**
     * Return key phrases found in the input paragraph
     * @param callback: callback function that will be called with the result
     * @param input
     * @param config
     * @param profile
     * @param constants
     */
    async detectKeyPhrases(callback, input, config, profile, constants) {
        let params = {
            LanguageCode: input.lang,
            Text: input.paragraph,
        };
        try {
            this.comprehend.detectKeyPhrases(params,
                function(err, data) {
                    if (err) {
                        callback(new ioType.IOTypes.Error("Error comprehend"));
                        console.log(err);
                    }
                    if (data && 'KeyPhrases' in data) {
                        callback(new ioType.IOTypes.TaggedText(input.paragraph, data['KeyPhrases']));
                    } else {
                        console.log('detectKeyPhrases: no data returned!');
                        callback(new ioType.IOTypes.Error("Text could not be analyzed"));
                    }
                });
        } catch (error) {
            console.log(error);
            if (error.message) {
                callback(new ioType.IOTypes.Error("Error:" + error.message));
            } else {
                callback(new ioType.IOTypes.Error("Error in comprehend"));
            }
        }
    }

    /**
     * Return keywords found in the input paragraph. Keywords are considered following two simple heuristics:
     * 1. They appear in a keyphrase as returned by the detectKeyPhrases method with a very high confidence score
     * 2. They have a meaningful POS tag (i.e. not a symbol or punctuation)
     * @param callback
     * @param input
     * @param config
     * @param profile
     * @param constants
     */
    async detectKeywords(callback, input, config, profile, constants) {
        const importanceThreshold = 0.99;
        const ignoredPOSTags = ['AUX', 'O', 'PART', 'PUNCT', 'SYM'];
        await this.getSentencesWithTags(input.paragraph, input.lang, true,
            async function (result) {
                if (result && !('parsed_sentences' in result)) {
                    callback(new ioType.IOTypes.Error("No sentences found!"));
                }
                const sentencesWithTags = result['parsed_sentences'];
                let params = {
                    LanguageCode: input.lang,
                    Text: input.paragraph,
                };
                try {
                    await this.comprehend.detectKeyPhrases(params,
                        function(err, data) {
                            if (data && 'KeyPhrases' in data) {
                                let tokensInfo = [];
                                const keyPhrases = data['KeyPhrases'];
                                let n_keywords = 0;
                                let currentOffset = 0;
                                for (const sentenceInfo of sentencesWithTags) {
                                    let pos = Object.keys(sentenceInfo)[0];
                                    let sentenceOffset = sentenceInfo[pos]['BeginOffset'];
                                    let sentenceEndOffset = sentenceInfo[pos]['EndOffset'];
                                    for (const token of sentenceInfo[pos]['tokens']) {
                                        let tokenTags = [token.posTag];
                                        for (const keyPhrase of keyPhrases) {
                                            if (keyPhrase['BeginOffset'] >= sentenceOffset && keyPhrase['EndOffset'] <= sentenceEndOffset && keyPhrase['Score'] >= importanceThreshold) {
                                                if (token['BeginOffset'] >= keyPhrase['BeginOffset'] && token['EndOffset'] <= keyPhrase['EndOffset'] && !ignoredPOSTags.includes(token['posTag'])) {
                                                    tokenTags.push("keyword");
                                                    n_keywords++;
                                                }
                                            }
                                        }
                                        if (token['EndOffset'] > currentOffset) {
                                            currentOffset = token['EndOffset'];
                                            tokensInfo.push(ioType.IOTypes.TaggedText.createTag(
                                                token.text, tokenTags, token.token, token.BeginOffset, token.EndOffset
                                            ));
                                        }
                                    }
                                }
                                if (tokensInfo.length > 0 && n_keywords > 0) {
                                    const annotatedParagraph = new ioType.IOTypes.TaggedText(input.paragraph, tokensInfo);
                                    callback(annotatedParagraph);
                                } else {
                                    callback(new ioType.IOTypes.Error("Text could not be analyzed"));
                                }
                            } else {
                                console.log('detectKeyPhrases: no data returned!');
                                callback(new ioType.IOTypes.Error("Text could not be analyzed"));
                            }
                        }
                    );
                } catch (error) {
                    console.log(error);
                    if (error.message) {
                        callback(new ioType.IOTypes.Error("Error:" + error.message));
                    } else {
                        callback(new ioType.IOTypes.Error("Text could not be analyzed"));
                    }
                }
            });
    }
}


module.exports.class = AWSTextAnalysis;