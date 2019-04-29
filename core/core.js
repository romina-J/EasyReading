let core = {

    debugMode: false,
    engines: [],
    userInterfaces: [],
    widgets: [],
    presentations: [],
    busyAnimations: [],
    plugins: [],
    static: [],
    databaseManager: null,

    startUp: async function () {

        let errorMsg = null;


        try {
            loadUtils(core);
            console.log("Load utils complete");

            await initDatabases(this);
            console.log("Init database complete");

            await this.databaseManager.createBaseTables();
            console.log("Init base tables complete");

            initTmpDir();
            console.log("Init temp dir complete");



            loadEngines(core);
            console.log("Load engines complete");

            loadStaticComponents(core);
            console.log("Load static components complete");

            loadPlugins(core);
            console.log("Load plugins complete");

            loadUserInterfaces(core);
            console.log("Load user interfaces complete");

            loadWidgets(core);
            console.log("Load widgets complete");

            loadPresentations(core);
            console.log("Load presentations complete");

            loadBusyAnimations(core);
            console.log("Load busy animations complete");


            await createDatabaseTables(core);
            console.log("Database tables init complete");

            initServer(core);
            console.log("Init server complete");


            /*

       Testing saving and reloading a profile

       */
            /*
                        let profile = require("./profile/profile");
                        let defaultProfile = new profile();

                        await defaultProfile.login("hashed google id here....");

                        await defaultProfile.save();

                        await defaultProfile.delete();


                        console.log(defaultProfile);
                        */

        } catch (error) {
            errorMsg = error;
        }


        return new Promise(function (resolve, reject) {

            if (errorMsg) {
                reject(errorMsg);
            } else {
                resolve();
            }

        });


    },


    getUserInterface(userInterfaceID, version) {
        for (let i = 0; i < this.userInterfaces.length; i++) {
            if (userInterfaceID === this.userInterfaces[i].id) {
                if (!version) {
                    return this.userInterfaces[i].versions[this.userInterfaces[i].versions.length - 1].version;
                } else {
                    for (let j = 0; j < this.userInterfaces[i].versions.length; j++) {
                        if (this.userInterfaces[i].versions[j].id === version) {
                            return this.userInterfaces[i].versions[j].version;
                        }
                    }
                    return this.userInterfaces[i].versions[this.userInterfaces[i].versions.length - 1].version;
                }
            }
        }
    },

    getPlugin(pluginID, version) {
        for (let i = 0; i < this.plugins.length; i++) {
            if (pluginID === this.plugins[i].id) {
                if (!version) {
                    return this.plugins[i].versions[this.plugins[i].versions.length - 1].version;
                } else {
                    for (let j = 0; j < this.plugins[i].versions.length; j++) {
                        if (this.plugins[i].versions[j].id === version) {
                            return this.plugins[i].versions[j].version;
                        }
                    }
                    return this.plugins[i].versions[this.plugins[i].versions.length - 1].version;
                }
            }
        }
    },
    getBusyAnimation(busyAnimationID, version) {
        for (let i = 0; i < this.busyAnimations.length; i++) {
            if (busyAnimationID === this.busyAnimations[i].id) {
                if (!version) {
                    return this.busyAnimations[i].versions[this.busyAnimations[i].versions.length - 1].version;
                } else {
                    for (let j = 0; j < this.busyAnimations[i].versions.length; j++) {
                        if (this.busyAnimations[i].versions[j].id === version) {
                            return this.busyAnimations[i].versions[j].version;
                        }
                    }
                    return this.busyAnimations[i].versions[this.busyAnimations[i].versions.length - 1].version;
                }
            }
        }
    },

    getEngine(engineID, version) {
        for (let i = 0; i < this.engines.length; i++) {
            if (engineID === this.engines[i].engine) {

                if (!version) {
                    return this.engines[i].versions[this.engines[i].versions.length - 1].engine;
                } else {

                    for (let j = 0; j < this.engines[i].versions.length; j++) {
                        if (this.engines[i].versions[j].version === version) {
                            return this.engines[i].versions[j].engine;
                        }
                    }
                    return this.engines[i].versions[this.engines[i].versions.length - 1].engine;
                }
            }
        }
    }
    ,
    getWidget(widgetID, version) {
        for (let i = 0; i < this.widgets.length; i++) {
            if (widgetID === this.widgets[i].id) {

                if (!version) {
                    return this.widgets[i].versions[this.widgets[i].versions.length - 1].version;
                } else {

                    for (let j = 0; j < this.widgets[i].versions.length; j++) {
                        if (this.widgets[i].versions[j].id === version) {
                            return this.widgets[i].versions[j].version;
                        }
                    }
                    return this.widgets[i].versions[this.widgets[i].versions.length - 1].version;
                }
            }

        }
    }
    ,
    getPresentation(presentationID, version) {
        for (let i = 0; i < this.presentations.length; i++) {
            if (presentationID === this.presentations[i].id) {
                if (!version) {
                    return this.presentations[i].versions[this.presentations[i].versions.length - 1].version;
                } else {
                    for (let j = 0; j < this.presentations[i].versions.length; j++) {
                        if (this.presentations[i].versions[j].id === version) {
                            return this.presentations[i].versions[j].version;
                        }
                    }
                    return this.presentations[i].versions[this.presentations[i].versions.length - 1].version;
                }
            }
        }
    }
    ,
    createDefaultConfigurationForEngine(engineID, version, userInterface) {
        let engine = this.getEngine(engineID, version);
        //   let functions = engine.getFunctions();
        let functionConfiguration = [];
        for (let i = 0; i < engine.functions.length; i++) {

            let currentConfiguration = {
                function: {
                    source: engine.functions[i].getFunctionInformation(),
                    configuration: engine.getDefaultData(),
                },
                layout: userInterface.getDefaultToolLayoutConfiguration(),
                widget: this.getDefaultWidgetForFunction(engine.functions[i]),
                presentation: this.getDefaultDisplayForFunction(engine.functions[i]),

            };
            functionConfiguration.push(currentConfiguration);


        }

        return functionConfiguration;

    }
    ,
    getDefaultWidgetForFunction(func) {

        let base = require("./components/engines/base/engine-base");
        let ioType = rootRequire("core/IOtypes/iotypes");
        if (func.inputTypes[0].inputType === ioType.IOTypes.VoidIOType.className ||
            func.inputTypes[0].inputType === ioType.IOTypes.Page.className ||
            func.inputTypes[0].inputType === ioType.IOTypes.URLType.className) {

            let button = this.getWidget("button");
            return button.getDefaultConfiguration();

        } else if (func.inputTypes[0].inputType === ioType.IOTypes.Word.className ||
            func.inputTypes[0].inputType === ioType.IOTypes.Sentence.className ||
            func.inputTypes[0].inputType === ioType.IOTypes.Paragraph.className) {
            if (func.outputTypes[0].outputType === ioType.IOTypes.AudioType.className) {

                /*

                let continuousChoiceButton = this.getWidget("text-selector");
                return continuousChoiceButton.getDefaultConfiguration();
                */
                let continuousChoiceButton = this.getWidget("continuous-choice-button");
                return continuousChoiceButton.getDefaultConfiguration();


            } else {
                let singleChoiceButton = this.getWidget("single-choice-button");
                return singleChoiceButton.getDefaultConfiguration();
            }


        }

    }
    ,
    getDefaultDisplayForFunction(func) {
        let base = require("./components/engines/base/engine-base");
        let ioType = rootRequire("core/IOtypes/iotypes");
        if( func.outputTypes[0].outputType === ioType.IOTypes.Paragraph.className ||
            func.outputTypes[0].outputType === ioType.IOTypes.ParsedLanguageType.className){
            let toolTip = this.getPresentation("paragraph-switcher");
            return toolTip.getDefaultConfiguration();
        }else if (func.outputTypes[0].outputType === ioType.IOTypes.ImageIOType.className) {
            let toolTip = this.getPresentation("tippy-tooltip");
            return toolTip.getDefaultConfiguration();

        } else if (func.outputTypes[0].outputType === ioType.IOTypes.Word.className||
            func.outputTypes[0].outputType === ioType.IOTypes.Sentence.className) {

            let toolTip = this.getPresentation("tooltip");
            return toolTip.getDefaultConfiguration();

        } else if (func.outputTypes[0].outputType === ioType.IOTypes.AudioType.className) {


            let audioHighlighter = this.getPresentation("audio-highlighter");

            return audioHighlighter.getDefaultConfiguration();

        }

    }
    ,

    getDefaultBusyAnimation(){
      return core.getBusyAnimation("spinner").getDefaultConfiguration();
    },

    executeRequest(webSocketConnection, req, config) {

        let engine = this.getEngine(req.functionInfo.engineId, req.functionInfo.engineVersison);

        let curFunction = engine.getFunction(req.functionInfo.functionId);

        engine[curFunction.entryPoint](webSocketConnection, req, config);


    }

};


/*Private */

let userInterfaceInitializer = null;
let presentationInitializer = null;
let widgetInitializer = null;
let busyAnimationInitializer = null;
let pluginInitializer = null;

function initTmpDir() {
    let fs = require('fs-extra');
    let path = require('path');

    if (fs.existsSync(path.join(__dirname, "../", "/public/tmp/"))) {
        fs.removeSync(path.join(__dirname, "../", "/public/tmp/"));
        console.log("removing tmp dir!");
    }

    if (!fs.existsSync(path.join(__dirname, "../", "/public/tmp/"))) {
        fs.mkdirSync(path.join(__dirname, "../", "/public/tmp/"));
        console.log("creating temp dir");

    }
}


function loadUtils(core) {

    let globals = require("./util/global-functions");
    globals.loadGlobalFunctions();

    let credentialManager = require("./util/credential-manager");
    credentialManager.init();

}

function initDatabases(core) {

    let databaseManager = require("./database/database-manager");

    core.databaseManager = databaseManager;
    return databaseManager.connect();
    /*
    return new Promise((resolve, reject) => {


        databaseManager.connect().then(success => {


            if (success) {
                core.databaseManager = databaseManager;
                resolve(success);
            }

        });

    });
    */

}


function loadEngines(core) {
    let engineComposer = require("./components/engines/engine-composer");
    engineComposer.debugMode = core.debugMode;
    engineComposer.createEngines();
    core.engines = engineComposer.engines;

}

function loadStaticComponents(core) {

    let staticSources = [];
    staticSources.push("core/libraries/external/jquery.js");
    staticSources.push("core/libraries/external/xregexp-all.js");
    staticSources.push("core/libraries/sbd.js");
    staticSources.push("core/libraries/page-utils.js");
    staticSources.push("core/libraries/iotype-utils.js");
    staticSources.push("core/IOtypes/iotypes.js");
    staticSources.push("core/libraries/text-marker.js");
    staticSources.push("core/libraries/html-iterator.js");
    staticSources.push("core/libraries/global-event-listener.js");
    staticSources.push("core/libraries/start-up.js");
    staticSources.push("core/libraries/request-manager.js");
    if (core.debugMode) {
        staticSources.push("core/libraries/content-script-controller-debug.js");
    }
    staticSources.push("core/components/presentation/base/presentation-implementation.js");
    staticSources.push("core/components/user_interface/base/user-interface-implementation.js");
    staticSources.push("core/components/widget/base/widget-implementation.js");
    staticSources.push("core/components/busy-animation/base/busy-animation-implementation.js");
    staticSources.push("core/components/plugin/base/plugin-implementation.js");



    if (core.debugMode) {

        for (let i = 0; i < staticSources.length; i++) {
            core.static.push(copyToStaticWeb(staticSources[i]));
        }

    } else {
        let fs = require('fs');

        for (let i = 0; i < staticSources.length; i++) {

            let pathToJavaScriptFile = baseDirPath(staticSources[i]);
            if (!fs.existsSync(pathToJavaScriptFile)) {
                console.log("File not found:" + this.scripts[i]);
            } else {
                core.static.push(btoa(fs.readFileSync(pathToJavaScriptFile, "utf8")));

            }
        }

    }


}

function copyToStaticWeb(pathOfFileOrDir) {

    try {
        const fs = require('fs-extra');
        const path = require('path');
        let filename = path.basename(baseDirPath(pathOfFileOrDir));

        fs.copySync(baseDirPath(pathOfFileOrDir), baseDirPath("public/components/static/" + filename));
        return "components/static/" + filename;

    } catch (err) {

        console.error(err)

    }

}

function loadUserInterfaces(core) {

    let uiInitializerClass = require("./components/user_interface/user-interface-initializer");
    userInterfaceInitializer = new uiInitializerClass(core.debugMode);
    userInterfaceInitializer.initComponents();
    core.userInterfaces = userInterfaceInitializer.components;

}

function loadWidgets(core) {

    let widgetInitializerClass = require("./components/widget/widget-initializer");
    widgetInitializer = new widgetInitializerClass(core.debugMode);
    widgetInitializer.initComponents();
    core.widgets = widgetInitializer.components;

}

function loadPresentations(core) {

    let presentationInitializerClass = require("./components/presentation/presentation-initializer");
    presentationInitializer = new presentationInitializerClass(core.debugMode);
    presentationInitializer.initComponents();
    core.presentations = presentationInitializer.components;

}
function loadBusyAnimations(core) {

    let busyAnimationClass = require("./components/busy-animation/busy-animation-initializer");
    busyAnimationInitializer = new busyAnimationClass(core.debugMode);
    busyAnimationInitializer.initComponents();
    core.busyAnimations = busyAnimationInitializer.components;

}


function loadPlugins(core) {

    let pluginInitializerClass = require("./components/plugin/plugin-initializer");
    pluginInitializer = new pluginInitializerClass(core.debugMode);
    pluginInitializer.initComponents();
    core.plugins = pluginInitializer.components;

}

async function createDatabaseTables(core) {

    let errorMsg = null;
    try {

        let engineComposer = require("./components/engines/engine-composer");
        await engineComposer.createEngineTables();

        await userInterfaceInitializer.createComponentTables();

        await widgetInitializer.createComponentTables();

        await presentationInitializer.createComponentTables();

        await busyAnimationInitializer.createComponentTables();


    } catch (error) {
        errorMsg = error;
    }
    return new Promise(function (resolve, resign) {
        if (errorMsg) {
            resign(errorMsg);
        } else {
            resolve();
        }

    });
}


function initServer(core) {
    core.network = require("./network/network");
    core.network.initServer();

}

module.exports = core;