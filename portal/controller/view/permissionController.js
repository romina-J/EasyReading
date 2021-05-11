/** Permission module
 * @module permission
 * @requires express
 */

module.exports = {
    /**
     * Checks if the current user is logged in as client
     * @memberof module:permission
     * @param {Request} req Request object that includes the client token
     * @param {Response} res Response object that is used for redirection
     * @param {object} next Returns the response object
     * @returns Returns the next object
     */    
    isLoggedInAsClient:  (req, res, next) => {
        if(!req.session._clientToken){
            return res.redirect('/');
        }

        return next();
    },
    /**
     * Checks if the current user is logged in as client
     * @memberof module:permission
     * @param {Request} req Request object that includes the unique UserId
     * @param {Response} res Response object that is used for redirection
     * @param {object} next not used
     * @returns Returns res object
     */        
    hasPermission: async (req, res, next) => {
        if(req.method === "GET"){
            const id = parseInt(req.query.id);
            if (!id) {
                return res.redirect('/profiles');
            }

            if(id === req.user.id){
                return next();
            }

            try{
                let databaseManager = require("../../../core/database/database-manager");

                let loadExistingClientCarerRelationsRequest = databaseManager.createRequest("client_carer_relation").where("carer_id","=",req.user.id).where("client_id","=",id);
                let loadExistingClientCarerRelationsResult = await databaseManager.executeRequest(loadExistingClientCarerRelationsRequest);
                if(loadExistingClientCarerRelationsResult.result.length > 0){
                    return next();
                }
            }catch (e) {
                console.log(e);
            }

            return res.redirect('/profiles');
        }else{
            try{
                let id = req.user.id;
                if (req.body.id) {
                    id = req.body.id;
                }

                if(typeof  id === "string"){
                    id = parseInt(id);
                }

                if(id === req.user.id){
                    return next();
                }

                if(req.user.email === "peter.heumader@gmail.com" || req.user.email === "susanne.dirks@tu-dortmund.de"){
                    return next();
                }

                let databaseManager = require("../../../core/database/database-manager");

                let loadExistingClientCarerRelationsRequest = databaseManager.createRequest("client_carer_relation").where("carer_id","=",req.user.id).where("client_id","=",id);
                let loadExistingClientCarerRelationsResult = await databaseManager.executeRequest(loadExistingClientCarerRelationsRequest);
                if(loadExistingClientCarerRelationsResult.result.length > 0){
                    return next();
                }

                let profileRequest = databaseManager.createRequest("embedded_site_manager_profile").where("esm_id", "=",req.user.id).where("pid","=",id);
                let profileRequestResult = await databaseManager.executeRequest(profileRequest);
                if(profileRequestResult.result.length > 0){
                    return next();
                }
            }catch (e) {

                console.log(e);
            }

            return res.status(403);
        }
    }
};
