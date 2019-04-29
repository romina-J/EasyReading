"use strict";

/**
 * Input and Output Type
 */
class IOType {
    constructor(name="IOType", description="") {
        this.name = name;
        this.description = description;
    }
    static get className() {
        return 'IOType';
    }

    /**
     * HTML markup for the instance, excluding any metadata
     * @returns {string}
     */
    toHtml() {
        return '';
    }
}

class VoidIOType extends IOType {
    constructor( name = "VoidIOType", description = "") {
        super(name, description);
    }
    static get className() {
        return 'VoidIOType';
    }
}

class Word extends IOType {
    constructor(word, name="Word", description="") {
        super(name, description);
        this.word = word;
    }

    static get className() {
        return 'Word';
    }
    toHtml() {
        return this.word;
    }
}

class Sentence extends IOType {
    constructor(sentence,  name="Sentence", description="") {
        super(name, description);
        this.sentence = sentence;
    };
    static get className() {
        return 'Sentence';
    };
    toHtml() {
        return this.sentence;
    }
}

class Paragraph extends IOType {
    constructor(text, name="Paragraph", description="") {
        super(name, description);
        this.paragraph = text;
    }
    static get className() {
        return 'Paragraph';
    }
    toHtml() {
        return "<p>" + this.paragraph + "</p>";
    }
}

class ParsedLanguageType extends IOType {
    /**
     * @param {string} raw_string
     * @param {Array.<string>} sentences - sentence[word]
     * @param {Array.<string>} pos_tags - sentence[POS_tag of corresponding word]
     * @param {string} language
     * @param {string} name
     * @param {string} description
     */
    constructor(raw_string = "",
                sentences= [],
                pos_tags = [],
                language = "",
                name="ParsedLanguageType",
                description="A paragraph made up of sentences with syntactic metadata") {
        super(name, description);
        this.raw_string = raw_string;
        this.sentences= sentences;
        this.pos_tags = pos_tags;
        this.language = language;
    }
    toHtml() {
        let html = '';
        if (this.sentences instanceof Array) {
            html = '<p>';
            this.sentences.forEach((sentence, i) => {
                sentence.forEach((word, j) => {
                    let pos_tag = '';
                    if (i < this.pos_tags.length && j < this.pos_tags[i].length) {
                        pos_tag = '<span class="easy-reading-highlight">(';
                        pos_tag += this.pos_tags[i][j];
                        pos_tag += ')</span> ';
                    }
                    html += word + pos_tag;
                });
                html += '<br/>';
            });
            html += '</p>';
        } else if (this.raw_string) {
            html = this.raw_string;
        } else if (typeof this.sentences === 'string' || this.sentences instanceof String) {
            html = this.sentences;
            return html;
        }
    }
}

class Page extends IOType {
    constructor(page, name="Page", description="") {
        super(name, description);
        this.page = page;
    }
    static get className() {
        return 'Page';
    }
}

class ImageIOType extends IOType {
    constructor(url, alt="", title="", name="ImageIOType", description="") {
        super(name, description);
        this.url = url;
        this.alt = alt;
        this.title = title;
    }
    toHtml() {
        if (!this.url) {
            return "No images found.";
        } else {
            let altText = "";
            if(this.alt) {
                altText = this.alt;
            }
            let html = "<img src=\"" + this.url + "\" alt=\"" + altText + "\"";
            if (this.title) {
                html += " title=\"" + this.title + "\"";
            }
            html += "/>";
            return html;
        }
    }
    static get className() {
        return 'ImageIOType';
    }
}

class AudioType extends IOType {
    constructor(url, speechMarkURL = "", speechMarks = [], name="AudioType", description="") {
        super(name, description);
        this.mp3URL = url;
        this.speechMarkURL = speechMarkURL; // URL to a JSON file with speech marks
        this.speechMarks = speechMarks;
    }
    static get className() {
        return 'AudioType';
    }
    toHtml() {
        let html =  "<audio controls>";
        html += "<source src=\"" + this.mp3URL + "\" type=\"audio/mpeg\">";
        html += "Your browser does not support the audio tag. </audio>";
        return html;
    }
}

class JavaScriptType extends IOType {

    constructor(script="", name="JavaScriptType", description="") {
        super(name, description);
        this.script = script;
    }
    static get className() {
        return 'JavaScriptType';
    }
    toHtml() {
        if (this.script.startsWith("<script")) {
            return this.script;
        } else {
            return "<script>" + this.script + "</script>";
        }
    }
}

class URLType extends IOType {
    constructor(url, target="", name="URLType", description="") {
        super(name, description);
        this.url = new URL(url);
        this.target = "";
    }
    static get className() {
        return 'URLType';
    }
    toHtml() {
        let html =  "<a href=\"" + this.url.toString() + "\"";
        if (this.target) {
            html += " target=\"" + this.target + "\"";
        }
        html += "/>";
        return html;
    }
}

// Script running on NodeJS
if (typeof window === 'undefined') {
    module.exports.IOTypes = {
        VoidIOType: VoidIOType,
        Word: Word,
        Sentence: Sentence,
        Paragraph: Paragraph,
        ParsedLanguageType: ParsedLanguageType,
        Page: Page,
        ImageIOType: ImageIOType,
        AudioType: AudioType,
        URLType: URLType,
        JavaScriptType: JavaScriptType,
    };
}
