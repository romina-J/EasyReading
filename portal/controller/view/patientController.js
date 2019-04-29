const profileRepo = require("../../repository/profileRepo");
const engineRepo = require("..//..//repository/engineRepo");
const core = rootRequire("core/core");
const databaseManager = core.databaseManager;

// Returns the tool:user configuration if any exists in the database.
const getToolConfigFor = async (toolTable, googleId) => {

    //const toolConfigIdForUser = await getToolConfigIdForUser(googleId);
    const toolConfigIdForUser = await engineRepo.getEngineConfigByUserId(googleId);

    const engineConfig = [];
    for (const tool_conf of toolConfigIdForUser.result) {
       const getEngineConfigForUser = databaseManager
          .createRequest(toolTable)
          .where('id', '=', tool_conf.engine_conf_id)
          .select();
 
       const eEngineConfigForUser = await databaseManager.executeRequest(getEngineConfigForUser);
       engineConfig.push(eEngineConfigForUser);
    }
 
    return engineConfig;
 }

module.exports = {

    getPatientsByHealthCareWorker: async (req, res, next) => {

        //console.log(JSON.stringify(req.session.user));

        const { result: profiles } = await profileRepo.getPatientByHealthCareWorkerId(req.session.user.id);

        res.locals.context = {
            ...res.locals.context,
            profiles
        }

        return next();        
    },
    getOwnProfile: async (req, res, next) => {

      //console.log(JSON.stringify(req.session.user));

      const { result: profile } = await profileRepo.getOwnProfileId(req.session.user.id);

      res.locals.context = {
          ...res.locals.context,
          profile
      }

      return next();        
    },    
    getEngineConfigByuserId : async (req, res, next) => {

        const googleId = req.query.gid
     
        if (!googleId) return res.redirect('/profiles')
     
        const engines = [...rootRequire("core/core").engines];
        //const toolConfigIdForUser = await getToolConfigIdForUser(googleId);
        const toolConfigIdForUser = await engineRepo.getEngineConfigByUserId(googleId);
     
        const results = [];
        for (const engineType of engines) {
           for (const version of engineType.versions) {
     
              const engine = {
                 id: version.engine.id,
                 version: version.engine.version,
                 enable: false,
                 dataSchema: version.engine.getDataSchema(),
                 config: []
              }
     
              // check if this engine is congifured for this user
              for (const engineConfig of toolConfigIdForUser.result) {
                 if (engineConfig.engine_id === engine.id && engineConfig.engine_version === engine.version)
                    engine.enable = true;
              }
     
              // get the engine configuratoin properties if exist
              if (Object.keys(engine.dataSchema).length !== 0) {
                 const configTableNameForEngine = databaseManager.getConfigTableNameForEngine(version.engine);
                 const engineConfiguratoins = await getToolConfigFor(configTableNameForEngine, googleId)
                 // check if config.result[0] is not 0
                 engineConfiguratoins.forEach(config => {
                    if (config.result.length > 0)
                       engine.config.push({ ...config.result[0] });
                 });
              }
     
              results.push(engine);
           }
        }
        //console.log(JSON.stringify(results));
                
        res.locals.context = {
           engines: results,
           backURL: req.session.returnTo || '/',
           ...res.locals.context
        }
     
        //console.log(res.locals.context);
     
        return next();
    }
}