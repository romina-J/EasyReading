// This application uses express as its web server
// for more info, see: http://expressjs.com
const express = require('express')
const path = require('path')
const hbs = require('hbs');

const databaseManager = require('../database/database-manager')
const profileBuilder = require("../profile/profile-builder");

// Temporary mapping, decision needs to be made about how much to expose to the client
// ie, do we expose the table name or hide it by mapping it to a friendly name like this?
const tableMap = {
   colorize: 'colorize_1_0_config'
};

// create a new express server
const app = express();

// Ensure we automatically parse any json-bodies
app.use(express.json());

// Ensure express is looking at our views directory for templates
app.set('views', path.join(__dirname, '..', '..', 'public', 'views'))

app.set('view engine', 'hbs');
// app.set('view cache', true) // uncomment to cache already rendered views

const getToolConfigIdForUser = async (googleId) => {

/*
join sql to find the tool config id
TODO: move this to data layer
*/
   let sql = `SELECT tool_conf.* FROM profile p 
 INNER JOIN ui_collection ui_coll ON p.id = ui_coll.pid
 INNER JOIN ui_conf ui_conf ON ui_coll.id = ui_conf.ui_collection
 INNER JOIN tool_conf tool_conf ON ui_conf.id = tool_conf.ui_conf_id
 WHERE p.googleID="${googleId}"
   AND ui_coll.active = 1;`;

   const toolConfigIdForUser = await databaseManager.executeSql(sql);
   return toolConfigIdForUser;
};

// Returns the tool:user configuration if any exists in the database.
const getToolConfigFor = async (toolTable, googleId) => {

   const toolConfigIdForUser = await getToolConfigIdForUser(googleId);

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
};

// Build up a 'context' to feed our templates
const addProfilesToContext = async (req, res, next) => {
   const listProfilesRequest = databaseManager.createRequest("profile").select();
   const { result: profiles } = await databaseManager.executeRequest(listProfilesRequest);

   res.locals.context = {
      ...res.locals.context,
      profiles
   };

   return next()
};

// Build up a 'context' to feed our templates. Any property on the 'context' object
// is available inside the template.
const addToolsToContext = async (req, res, next) => {
   const googleId = req.query.gid;

   if (!googleId) return res.redirect('/profiles');

   const engines = [...rootRequire("core/core").engines];
   const toolConfigIdForUser = await getToolConfigIdForUser(googleId);

   const results = [];
   for (const engineType of engines) {
      for (const version of engineType.versions) {

         const engine = {
            id: version.engine.id,
            version: version.engine.version,
            enable: false,
            dataSchema: version.engine.getDataSchema(),
            config: []
         };

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
   console.log(JSON.stringify(results));
   // 'tools' is based on the tableMap above. It will attempt to retrieve
   // matching configuration for any tool defined. This makes it possible for us to
   // render a template based on the tools that are available for the current user.
   res.locals.context = {
      engines: results,
      ...res.locals.context
   };

   console.log(res.locals.context);

   return next()
};

const updateEngineConfiguratoin = async (req, res) => {

   console.log("updateEngineConfiguratoin");
   if (!req.body || !req.body.gid || !req.body.engines) {
      return res.sendStatus(401).end()
   }

   let profile = {};
   try {
      //const googleId = "pbkdf2$10000$c2739b3c7f7a9c5736b93f1a7c2b43684922345861fd209b332296dcc7d422027b487ce87211715aa9cb70ecc90ce18e80fe5f7ade7eb74975bf1a4a08903e70$";
      const googleId = req.body.gid;
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
      }
   } catch (error) {
      return res.sendStatus(500).end();
   }

   return res.sendStatus(200).end()
};

const loadProfileWithNewEngineConfig = (engineConfigObjs, profile) => {

   const core = rootRequire("core/core");
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
   profile.static = core.static;
   profile.userLoaded = true;

   return profile;
};

// View routes
app.get('/', (_, res) => res.render('index', res.locals.context))
app.get('/profiles', addProfilesToContext, (_, res) => res.render('profiles', res.locals.context))
app.get('/configure', addToolsToContext, (_, res) => res.render('configure', res.locals.context))

// API routes
app.post('/api/v1/configuration', updateEngineConfiguratoin)

// Serve the files out of ./public as our main files
app.use(express.static(baseDirPath('public')));

module.exports = app;

hbs.registerHelper('convertToString', function (data) {
   return JSON.stringify(data)
});

hbs.registerHelper('addInputField', function (tool, index) {
   let form = createCheckBox(tool.enable, index);
   if (tool.dataSchema.properties) {
      form += createInputFields(tool.dataSchema.properties, tool.dataSchema.required, tool.config[0], index)
   }
   return new hbs.SafeString(form)
});

function createCheckBox(isChecked, index) {
   let checked = isChecked ? 'checked' : '';
   let id = 'enable-' + index;
   return 'Enable: <input id="' + id + '" type="checkbox" ' + checked + '/><br>'
}

function createInputFields(properties, required, config, index) {
   let inputFields = '';

   Object.keys(properties).forEach(function (key) {
      let isRequired = (required.indexOf(key) > -1);
      let prePopulatedValue = getPrePopulatedValue(properties[key], config, key);
      inputFields += createInputFieldForColor(properties[key], key, isRequired, prePopulatedValue, index);
      inputFields += createDropdownList(properties[key], key, isRequired, prePopulatedValue, index)
   });

   return inputFields
}

function createInputFieldForColor(property, key, isRequired, prePopulatedValue, index) {
   let id = key + '-' + index;
   let inputField = '';
   let required = isRequired ? 'required' : '';

   if (property.format && property.format === 'color') {
      inputField += key + ': <input id="' + id + '" type="color" value="' + prePopulatedValue + '"' + required + '/><br>'
   }

   return inputField
}

function createDropdownList(property, key, isRequired, prePopulatedValue, index) {
   let id = key + '-' + index;
   let inputField = '';
   let required = isRequired ? 'required' : '';

   if (property.enum) {
      inputField += key + ': <select id="' + id + '" ' + required + '>';
      for (let i = 0; i < property.enum.length; i++) {
         let isSelected = prePopulatedValue === property.enum[i] ? 'selected' : '';
         inputField += '<option value="' + property.enum[i] + '" ' + isSelected + '>' + property.enum[i] + '</option>'
      }
      inputField += '</select><br>'
   }

   return inputField
}

function getPrePopulatedValue(property, config, key) {
   if (config) {
      let value = config[key];
      if (value) {
         return value
      }
   }
   return property.default
}
