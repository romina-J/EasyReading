let UserInterfaceBase = rootRequire("core/components/user_interface/base/user-interface-base");

class TabSlideOutUserInterface extends UserInterfaceBase{

    constructor(baseDir) {
        super(baseDir);

        this.name = "TabSlideOut";
        this.description = "Simple tab slide out";
        this.versionDescription = "Initial Version";
        this.scripts = ["ui/jquery.tabSlideOut.js", "ui/tab-slide-out-ui.js"];
        this.css = ["ui/jquery.tabSlideOut.css"];
        this.assetDirectory = "ui/images";
        this.implementationClass = "TabSlideOutUserInterface";

    }



}

module.exports.class = TabSlideOutUserInterface;