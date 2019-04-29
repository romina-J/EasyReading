const core = rootRequire("core/core");
const databaseManager = core.databaseManager;
const profileBuilder = rootRequire("core/profile/profile-builder");

const loadProfileWithNewEngineConfig = (engineConfigObjs, profile) => {

    //const core = rootRequire("core/core");
    const overlay = core.getUserInterface("overlay", "1.0");
    const overlayConfig = overlay.getDefaultConfiguration();
 
    for (const engine of engineConfigObjs) {
       const defaultConfigurationForEngine = core.createDefaultConfigurationForEngine(engine.id, engine.version, overlay);
       if (defaultConfigurationForEngine.length > 0 &&
          defaultConfigurationForEngine[0].function.configuration) {
          const engineConfigProperties = Object.keys(engine.config[0]).filter(property => property !== "id");
          for (const engineConfigProperty of engineConfigProperties)
             defaultConfigurationForEngine[0].function.configuration[engineConfigProperty] = engine.config[0][engineConfigProperty];
       }
       overlayConfig.tools = overlayConfig.tools.concat(defaultConfigurationForEngine);
    }
 
    profile.userInterfaces.push(overlayConfig);
 
    let tabSlideOut = core.getUserInterface("tab-slide-out", "1.0");
    let tabSlideOutConfig = tabSlideOut.getDefaultConfiguration();
 
    for (const engine of engineConfigObjs) {
       const defaultConfigurationForEngine = core.createDefaultConfigurationForEngine(engine.id, engine.version, tabSlideOut);
       if (defaultConfigurationForEngine.length > 0 &&
          defaultConfigurationForEngine[0].function.configuration) {
          const engineConfigProperties = Object.keys(engine.config[0]).filter(property => property !== "id");
          for (const engineConfigProperty of engineConfigProperties)
             defaultConfigurationForEngine[0].function.configuration[engineConfigProperty] = engine.config[0][engineConfigProperty];
       }
       tabSlideOutConfig.tools = tabSlideOutConfig.tools.concat(defaultConfigurationForEngine);
    }
 
    profile.userInterfaces.push(tabSlideOutConfig);
 
    profile.debugMode = core.debugMode;
    profile.userLoaded = true;
 
    return profile;
 };
 


module.exports = {

    updateEngineConfiguratoin : async (req, res) => {

        //console.log("updateEngineConfiguratoin");
        if (!req.body || (!req.body.gid && !req.user.googleID) || !req.body.engines) {
           return res.sendStatus(401).end()
        }

        let profileClass = require("../../../core/profile/profile");
        let profile = new profileClass();
        try {
            let googleId = req.user.googleID;
            if(req.body.gid){
                googleId = req.body.gid;
            }

           const loadProfileRequest = databaseManager.createRequest("profile").where("googleID", "=", googleId);
           const loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);
     
           if (loadProfileRequestResult.result.length > 0) {
              profile.id = loadProfileRequestResult.result[0].id;
              await profileBuilder.loadActiveUserInterfaces(profile);
     
              // reset userInterfaces
              profile.userInterfaces = [];
     
              const engineConfigObjs = JSON.parse(req.body.engines);
              const enabledEngineConfigObjs = engineConfigObjs.filter(config => config.enable);
     
              loadProfileWithNewEngineConfig(enabledEngineConfigObjs, profile);

              await profileBuilder.saveUserInterfaceConfiguration(profile, true);

              let network = require("../../../core/network/network");
              network.updateProfileForConnectedClients(profile);

           }
        } catch (error) {
           return res.sendStatus(500).end();
        }
     
        return res.sendStatus(200).end()
     }
}