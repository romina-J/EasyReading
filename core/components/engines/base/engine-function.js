'use strict';

const InputType = {
    WORD: "word",
    SENTENCE: "sentence",
    PARAGRAPH: "paragraph",
    PAGE: "page",
    IMAGE: "image",
    VOID: "void",
    URL: "url",
};

const OutputType = {
    WORD: "word",
    SENTENCE: "sentence",
    PARAGRAPH: "paragraph",
    PAGE: "page",
    IMAGE: "image",
    VOID: "void",
    AUDIO: "audio",
    VIDEO: "video",
    JAVASCRIPT:"javascript",
};

const FunctionType = {
    REMOTE: "remote",
    LOCAL: "local"
};


class Function {
    constructor(engine, id ,name, description, inputTypes, outputTypes, defaultIcon) {
        this.engine = engine;
        this.id = id;
        this.name = name;
        this.description = description;
        this.inputTypes = inputTypes;
        this.outputTypes = outputTypes;
        this.defaultIcon = defaultIcon;

    }

    validateProperties() {
        let fs = require('fs');

        //Check defaultIcon
        let defaultIconPath = require("path").join(this.engine.baseDir, this.defaultIcon);
        if (fs.existsSync(defaultIconPath)) {

            this.copyFileToWeb(this.defaultIcon);
        } else {
            console.log("File not found:" + this.defaultIcon);
        }
    }

    copyFileToWeb(pathToFile) {

        try {
            const fs = require('fs-extra');
            fs.copySync(require("path").join(this.engine.baseDir, pathToFile), baseDirPath("public/components/engines/" + this.engine.id + '/' + this.engine.version + '/' + pathToFile));

            return "/components/engines/" + this.engine.id + '/' + this.engine.version + '/' + pathToFile;
        } catch (err) {
            console.error(err)
        }


    }

    getFunctionInformation() {
        return {
            id: this.id,
            engine: this.engine.getEngineIdentifier(),
            debugMode: this.engine.debugMode,
            name: this.name,
            description: this.description,
            inputTypes: this.inputTypes,
            outputTypes: this.outputTypes,
            defaultIcon: this.defaultIcon,
            defaultIconURL: "components/engines/" + this.engine.id + "/" + this.engine.version+ "/" + this.defaultIcon,
            remoteBaseDirectory: "components/engines/" + this.engine.id + '/' + this.engine.version + '/',
        };


    }

}

class RemoteFunction extends Function {
    constructor(engine, id, name, description, inputTypes, outputTypes, defaultIcon, entryPoint) {
        super(engine, id, name, description, inputTypes, outputTypes, defaultIcon);

        this.type = "RemoteFunction";
        this.entryPoint = entryPoint;

    }

    validateProperties() {
        super.validateProperties();

        if (typeof  this.engine[this.entryPoint] !== 'function') {

            console.log("Entry point:" + this.entryPoint + " for " + this.name + " not found");
        }

    }

    getFunctionInformation() {
        let functionInfo = super.getFunctionInformation();
        functionInfo.type = this.type;
        functionInfo.entryPoint = this.entryPoint;
        return functionInfo;

    }

}


class LocalFunction extends Function {
    constructor(engine, id, name, description, inputTypes, outputTypes, defaultIcon, javaScripts, styleSheets, entryPoint) {
        super(engine, id, name, description, inputTypes, outputTypes, defaultIcon);

        this.type = "LocalFunction";
        this.javaScripts = javaScripts;
        this.styleSheets = styleSheets;
        this.entryPoint = entryPoint;
        this.assetDirectory = "";
        this.remoteAssetDirectory = "";
        this.contentScripts = [];
        this.contentCSS = [];
        this.remoteScripts = [];
        this.remoteCSS = [];
        /*
        this.loadedJavaScripts = [];
        this.loadedStyleSheets = [];

        this.remoteJavaScripts = [];
        this.remoteStyleSheets = [];
        */
    }

    validateProperties() {
        super.validateProperties();

        let fs = require('fs');

        if (this.assetDirectory !== "") {
            let pathToAssetDir = require("path").join(this.baseDir, this.assetDirectory);
            let stat = fs.statSync(pathToAssetDir);
            if (stat && stat.isDirectory()) {
                this.remoteAssetDirectory = this.copyToWeb(this.assetDirectory);
            } else {
                console.log("Asset Directory not found:" + this.assetDirectory);
            }
        }

        for (let i = 0; i < this.javaScripts.length; i++) {
            let pathToJavaScriptFile = require("path").join(this.engine.baseDir, this.javaScripts[i]);
            if (!fs.existsSync(pathToJavaScriptFile)) {
                console.log("File not found:" + this.javaScripts[i]);
            } else {

                if (this.engine.debugMode) {
                    let scriptURL = this.copyFileToWeb(this.javaScripts[i]);
                    this.remoteScripts.push(scriptURL);
                } else {
                    this.contentScripts.push(
                        {
                            id: this.engine.id+'/'+this.engine.version+this.javaScripts[i],
                            source: btoa(fs.readFileSync(pathToJavaScriptFile, "utf8")),
                        });

                }

            }
        }

        for (let i = 0; i < this.styleSheets.length; i++) {
            let pathToStyleSheet = require("path").join(this.engine.baseDir, this.styleSheets[i]);
            if (!fs.existsSync(pathToStyleSheet)) {
                console.log("File not found:" + this.styleSheets[i]);
            } else {

                if (this.engine.debugMode) {
                    let styleSheetURL = this.copyFileToWeb(this.styleSheets[i]);
                    this.remoteCSS.push(styleSheetURL);
                } else {

                    this.contentCSS.push(
                        {
                            id: this.engine.id+'/'+this.engine.version+this.styleSheets[i],
                            css: btoa(fs.readFileSync(pathToStyleSheet)),
                        });

                }

            }
        }

    }

    getFunctionInformation() {
        let functionInfo = super.getFunctionInformation();
        functionInfo.type = this.type;
        functionInfo.entryPoint = this.entryPoint;
        functionInfo.remoteAssetDirectory =  this.remoteAssetDirectory;

        if (this.engine.debugMode) {

            functionInfo.remoteScripts = this.remoteScripts;
            functionInfo.remoteCSS = this.remoteCSS;
        } else {


            //Clone of script and css are made
            functionInfo.contentScripts = [];
            for(let i=0; i < this.contentScripts.length; i++){
                functionInfo.contentScripts.push(Object.assign({}, this.contentScripts[i]));

            }

            functionInfo.contentCSS = [];
            for(let i=0; i < this.contentCSS.length; i++){
                functionInfo.contentCSS.push(Object.assign({}, this.contentCSS[i]));

            }

            //functionInfo.contentScripts = this.contentScripts;
            //functionInfo.contentCSS = this.contentCSS;

        }

        return functionInfo;

    }

}


let schemas = require("./schemas");
module.exports.LocalFunction = LocalFunction;
module.exports.RemoteFunction = RemoteFunction;
module.exports.LocalFunctionSchema = schemas.LocalFunctionSchema;
module.exports.RemoteFunctionSchema = schemas.RemoteFunctionSchema;
module.exports.InputType = InputType;
module.exports.OutputType = OutputType;
module.exports.FuntionType = FunctionType;