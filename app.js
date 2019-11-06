var core = require("./core/core");
core.debugMode = true;

core.startUp().catch(function (error) {
    console.log(error);
});

