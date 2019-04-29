let PresentationBase = rootRequire("core/components/presentation/base/presentation-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class AudioHighlighter extends PresentationBase {
    constructor(baseDir){

        super(baseDir);

        this.name = "AudioHighlighter";
        this.description = "Plays audio and highlights current spoken words";
        this.versionDescription = "Initial Version";
        this.scripts = ["presentation/audio-highlighter.js"];
        this.css = ["presentation/audio-highlighter.css"];
        this.assetDirectory= "";
        this.implementationClass = "AudioHighlighter";
        this.outputTypes = [{
            "outputType": ioType.IOTypes.AudioType.className,
            "name": "Output Audio",
            "description": "Audio with optional speech marks to embed",
        }];
    }

    getConfigurationSchema() {

        return {};
    }


}

module.exports.class = AudioHighlighter;