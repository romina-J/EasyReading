let UserInterfaceBase = rootRequire("core/components/user_interface/base/user-interface-base");

class OverlayUserInterface extends UserInterfaceBase{

    constructor(baseDir) {
        super(baseDir);

        this.name = "Overlay";
        this.description = "Simple overlay user interface base on jQuery ui";
        this.versionDescription = "Initial Version";
        this.scripts = ["ui/jquery-ui.js", "ui/overlay-ui.js", "ui/imagesloaded.pkgd.js"];
        this.css = ["ui/jquery-ui.css","ui/overlay-ui.css"];
        this.assetDirectory = "ui/images";
        this.implementationClass = "OverlayUserInterface";
        this.supportCategories = ["overlay"];
    }

    getConfigurationSchema() {

        return {
            "type": "object",
            "properties": {
                "startPositionXInPercent": {
                    "type": "integer",
                    "title" : "X Start Position",
                    "description": "Dialog start position x in percent",
                    "default": 20,
                    "minimum": 1,
                    "maximum": 100,

                },
                "startPositionYInPercent": {
                    "type": "integer",
                    "title" : "Y Start Position",
                    "description": "Dialog start position Y in percent",
                    "default": 20,
                    "minimum": 1,
                    "maximum": 100,
                },
                "buttonSize": {
                    "type": "integer",
                    "title" : "Button Size",
                    "description": "Size of buttons in pixels",
                    "default": 80,
                    "minimum": 50,
                    "maximum": 150,
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