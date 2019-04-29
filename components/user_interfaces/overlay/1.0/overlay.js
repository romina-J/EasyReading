let UserInterfaceBase = rootRequire("core/components/user_interface/base/user-interface-base");

class OverlayUserInterface extends UserInterfaceBase{

    constructor(baseDir) {
        super(baseDir);

        this.name = "Overlay";
        this.description = "Simple overlay user interface base on jQuery ui";
        this.versionDescription = "Initial Version";
        this.scripts = ["ui/jquery-ui.js", "ui/overlay-ui.js"];
        this.css = ["ui/jquery-ui.css","ui/overlay-ui.css"];
        this.assetDirectory = "ui/images";
        this.implementationClass = "OverlayUserInterface";
        this.debugMode = true;
    }

    getConfigurationSchema() {

        return {
            "type": "object",
            "properties": {
                "startPositionXInPercent": {
                    "type": "integer",
                    "title": "Dialog start position x in percent",
                    "default": 20,

                },
                "startPositionYInPercent": {
                    "type": "integer",
                    "title": "Dialog start position y in percent",
                    "default": 20,
                },
                "maxWidthInPercent": {
                    "type": "integer",
                    "title": "Dialog max width in percent",
                    "default": 30,

                },
                "maxHeightInPercent": {
                    "type": "integer",
                    "title": "Dialog max height in percent",
                    "default": 15,
                }
            }
        }
    }

    getToolLayoutConfigurationSchema() {

        return {
            "type": "object",
            "properties": {
                "iconHeight": {
                    "type": "integer",
                    "title": "Icon height in percent",
                    "default": 50,

                }
            }
        }
    }

}

module.exports.class = OverlayUserInterface;