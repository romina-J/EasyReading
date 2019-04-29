let ComponentBase = require("./../../base/component-base");

class WidgetBase extends  ComponentBase {
    constructor(baseDir) {
        super(baseDir);
        this.componentID = "widget";
        this.name = "BaseWidget";
        this.description = "BaseWidget description";
        this.implementationClass = "WidgetImplementation";
        this.componentCategory = "widget";
    }
}

module.exports = WidgetBase;