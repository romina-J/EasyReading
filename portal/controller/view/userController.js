let databaseManager = require("../../../core/database/database-manager");
let localeService = require("../../../core/i18n/locale-service");
/** User module
 * @module user
 * @requires express
 */

module.exports = {
    /**
     * Sets the user roles 
     * @memberof module:user
     * @param {Request} req Request object that includes the user
     * @param {Response} res Response object that is used for storing the content
     * @param {object} next Returns the response object
     * @returns Returns the next object
     */        
    setUser: async (req, res, next) => {
        res.locals.user = req.user;
        res.locals.healthcareworker = false;
        res.locals.roles = [];
        if (req.user) {
            res.locals.healthcareworker = req.user.role === 1;



            let loadProfileRoleRequest = databaseManager.createRequest("role").where("user_id", "=", req.user.id);
            let loadProfileRoleRequestResult = await databaseManager.executeRequest(loadProfileRoleRequest);

            res.locals.roles = [];
            let userLocale = req.locale;
            if(req.session.user.locale){
                userLocale = req.session.user.locale.split("_")[0];
            }


            for (let i = 0; i < loadProfileRoleRequestResult.result.length; i++) {
                res.locals.roles.push(loadProfileRoleRequestResult.result[i].role);


            }
            if(req.user.email === "peter.heumader@gmail.com"){
                res.locals.roles.push("admin");
            }


            let translatedRoles = [];
            for(let i=0; i < res.locals.roles.length; i++){
                if(res.locals.roles[i] !== "backend_user"){
                    translatedRoles.push(localeService.translate({
                        phrase: res.locals.roles[i]+"_role_text",
                        locale: userLocale
                    }));
                }
            }


            let roleInformation = "";
            for(let i=0; i <translatedRoles.length; i++){

                if(i > 0){
                    roleInformation+=", ";
                }
                roleInformation+=translatedRoles[i];

            }

            res.locals.roleInformation = roleInformation;






        }else{
            res.locals.roles.push("anonymous_user");
        }

        return next();
    }
};