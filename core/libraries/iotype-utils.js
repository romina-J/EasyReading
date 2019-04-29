/**
 * Utility methods for handling I/O Types
 * @Class ioTypeUtils
 */
var ioTypeUtils = {
    /**
     * Converts an object to a specific IOType instance
     * @param ioObject
     * @returns IOType instance
     */
    toIOTypeInstance(ioObject) {
        let IOret = new IOType();
        if (typeof(ioObject) === "object" && ioObject.name !== undefined) {
            switch (ioObject.name) {
                case 'VoidIOType':
                    IOret = new VoidIOType();
                    break;
                case 'Word':
                    IOret = new Word(ioObject.word);
                    break;
                case 'Sentence':
                    IOret = new Sentence(ioObject.sentence);
                    break;
                case 'ImageIOType':
                    IOret = new ImageIOType(ioObject.url, ioObject.alt, ioObject.title);
                    break;
                case 'AudioType':
                    IOret = new AudioType(ioObject.mp3URL, ioObject.speechMarkURL, ioObject.speechMarks);
                    break;
                case 'JavaScriptType':
                    IOret = new JavaScriptType(ioObject.script);
                    break;
                case 'URLType':
                    IOret = new URLType(ioObject.url, ioObject.target);
                    break;
            }
        } else {
            return ioObject; // Backwards compatibility
        }
        return IOret;
    },
};