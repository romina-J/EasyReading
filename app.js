var core = require("./core/core");
core.debugMode = false;
core.createSpeech = false;
core.createEmbeddedJavaScript = false;
core.updateCaretakerBackendUserRoles = true;

core.startUp().catch(function (error) {
    console.log(error);
});

