let UserInterfaceBase = rootRequire("core/components/user_interface/base/user-interface-base");

class TabSlideOutUserInterface extends UserInterfaceBase{

    constructor(baseDir) {
        super(baseDir);

        this.name = "TabSlideOut";
        this.description = "Simple tab slide out";
        this.versionDescription = "Initial Version";
        this.scripts = ["ui/jquery.tabSlideOut.js", "ui/tab-slide-out-ui.js", "ui/jquery-ui.js",
            "ui/imagesloaded.pkgd.js"];
        this.css = ["ui/jquery.tabSlideOut.css", "ui/jquery-ui.css", "ui/tab-slide-out-ui.css"];
        this.assetDirectory = "ui/images";
        this.implementationClass = "TabSlideOutUserInterface";

    }

    getConfigurationSchema() {

        return {
            "type": "object",
            "properties": {
                "tabPositioning": {
                    "type": "string",
                    "title": "Position on the screen where the tab will appear: left, right, top, or bottom",
                    "default": 'right',
                    "enum": ["top", "right", "bottom","left"],
                },
            }
        }
    }

}

module.exports.class = TabSlideOutUserInterface;