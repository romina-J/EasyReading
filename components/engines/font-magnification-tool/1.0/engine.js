let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class FontMagnificationTool extends base.EngineBase{
    constructor() {
        super();
        this.name = "Font magnification tool";
        this.description = "Tools that change font size";
        this.version = "1.0";
        this.versionDescription = "Initial version";
        this.bundles = [new base.FunctionBundle('fontMagnification','Font Size', 'Modify the font size of the current page.')]
    }

    getFunctions(){
        return [
            {
                id : "magnifyFont",
                sortOrder: "1",
                name: "Magnify font",
                description : "Magnifies the font size",
                defaultIcon : "assets/magnify.png",
                includeInDefaultProfile: true,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.LOCAL,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.layout_support.font_support,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType" : ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/font-magnification-tool.js'],
                styleSheets : [],
                entryPoint: "magnifyFont",
                bundle: this.bundles[0],
            },
            {
                id : "shrinkFont",
                sortOrder: "2",
                name: "Shrink font",
                description : "Shrinks the font size",
                defaultIcon : "assets/shrink.png",
                includeInDefaultProfile: true,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.LOCAL,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.layout_support.font_support,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/font-magnification-tool.js'],
                styleSheets : [],
                entryPoint: "shrinkFont",
                bundle: this.bundles[0],
            },

        ];
    }
}

module.exports.class = FontMagnificationTool;