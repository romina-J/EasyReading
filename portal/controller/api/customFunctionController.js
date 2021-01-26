/** Express router providing custom function related routes
 * @module routers/customFunction
 * @requires express
 */

let express = require('express');
let router = express.Router();
const core = rootRequire("core/core");

/**
 * Loads custom function for an id
 * @name get/
 * @memberof module:routers/customFunction
 * @param {Request} req Request object that includes the custom function id
 * @param {Response} res Response object that is used for storing the content
 * @param next Next object that just is returned
 */
router.get('/', async function(req, res, next){
    res.locals.user  = req.user;
    res.locals.engineFunctionDescriptions = JSON.stringify(core.engineFunctionDescriptions);

    let b = req.query;

    if(req.query.id){
        let databaseManager = require("./../../../core/database/database-manager");

        let customFunctionsSearchRequest = databaseManager.createRequest("custom_function").where("id", "=", req.query.id);

        let customFunctionsSearchRequestResult = await databaseManager.executeRequest(customFunctionsSearchRequest);

        for (let i = 0; i < customFunctionsSearchRequestResult.result.length; i++) {
            res.locals.customFunctionToLoad = JSON.stringify(customFunctionsSearchRequestResult.result[i]);
        }
    }

    return next();
});

/**
 * Create / Updates custom function
 * @name get/
 * @memberof module:routers/customFunction
 * @param {Request} req Request object that includes the custom functions that should be saved
 * @param {Response} res Response object that is used for redirect after saving. 
 * @param next Not used
 */
router.post('/',async function(req, res, next){

    try{
        let erfeSubmit = JSON.parse(req.body.erfeSubmit);

        if(erfeSubmit.type === "command"){
            if(erfeSubmit.command === "new"){
                return res.redirect('/client/function-editor');
            }else if(erfeSubmit.command === "exit"){

                return res.redirect('/client/function-overview');
            }
        }
        else if(erfeSubmit.type === "functionSubmit"){

            let customFunctionConfiguration = erfeSubmit.functionCode;

            customFunctionConfiguration.function_code = JSON.stringify(customFunctionConfiguration.json);
            customFunctionConfiguration.creator = req.user.id;

            let databaseManager = require("./../../../core/database/database-manager");

            if(req.body.erfeFunctionId){
                let updateFunctionRequest = databaseManager.createRequest('custom_function').update(customFunctionConfiguration).where("id", "=", req.body.erfeFunctionId);
                let updateFunctionRequestResult = await databaseManager.executeRequest(updateFunctionRequest);
            }else{
                let saveFunctionRequest = databaseManager.createRequest('custom_function').insert(customFunctionConfiguration);
                let saveFunctionRequestResult = await databaseManager.executeRequest(saveFunctionRequest);
            }
        }
    }catch (error){
        console.log(error);
    }

    return res.redirect('/client/function-overview');
});

module.exports = router;