/** User module
 * @module user
 * @requires express
 */

module.exports = {


    userManagement: async (req, res, next) => {

        res.locals.profiles =  [];

        let databaseManager = require("../../../core/database/database-manager");
        let backendUserRequest = databaseManager.createRequest("role").where("role", "=","backend_user" );
        let backendUserRequestResult = await databaseManager.executeRequest(backendUserRequest);

        if(backendUserRequestResult.result.length){
            for(let i=0; i < backendUserRequestResult.result.length; i++){


                let profileRequest = databaseManager.createRequest("profile").where("id","=",backendUserRequestResult.result[i].user_id);
                let profileRequestResult = await databaseManager.executeRequest(profileRequest);

                if(profileRequestResult.result.length){

                    for(let i=0; i < profileRequestResult.result.length; i++){

                        let roleRequest = databaseManager.createRequest("role").where("user_id", "=",profileRequestResult.result[i].id).where("role", "!=","backend_user");
                        let roleRequestResult = await databaseManager.executeRequest(roleRequest);
                        profileRequestResult.result[i].roles = "";
                        if(roleRequestResult.result.length){
                            for(let j=0; j < roleRequestResult.result.length; j++){
                                profileRequestResult.result[i].roles+=roleRequestResult.result[j].role;

                                if(j < roleRequestResult.result.length-1){
                                    profileRequestResult.result[i].roles+=","
                                }
                            }

                        }
                    }

                    res.locals.profiles.push(profileRequestResult.result[0]);
                }


            }

        }



        return next();
    },

    userEdit: async (req, res, next) => {
        let databaseManager = require("../../../core/database/database-manager");

        if (req.method === "POST") {

            let deleteRoleRequest = databaseManager.createRequest("role").where("user_id", "=",req.query.id).where("role","!=","client").delete();
            let deleteRoleRequestResult = await databaseManager.executeRequest(deleteRoleRequest);
            let request = databaseManager.createRequest("role").insert({
                user_id: req.query.id,
                role: "backend_user"
            });
            await  databaseManager.executeRequest(request);
            if(req.body.caretaker){
                let request = databaseManager.createRequest("role").insert({
                    user_id: req.query.id,
                    role: "caretaker"
                });
                await  databaseManager.executeRequest(request);
            }

            if(req.body.embedded_site_manager){
                let request = databaseManager.createRequest("role").insert({
                    user_id: req.query.id,
                    role: "embedded_site_manager"
                });
                await  databaseManager.executeRequest(request);
            }

            if(req.body.content_replacement_creator){
                let request = databaseManager.createRequest("role").insert({
                    user_id: req.query.id,
                    role: "content_replacement_creator"
                });
                await  databaseManager.executeRequest(request);
            }

            res.redirect('/admin/backend_user_management');
            return;
        }


        let profileRequest = databaseManager.createRequest("profile").where("id","=",req.query.id);
        let profileRequestResult = await databaseManager.executeRequest(profileRequest);

        if(profileRequestResult.result.length){



            res.locals.backendProfile = profileRequestResult.result[0];
        }

        res.locals.backendProfileRoles = {

            caretaker: false,
            embedded_site_manager: false,
            content_replacement_creator:false
        };

        let roleRequest = databaseManager.createRequest("role").where("user_id", "=",req.query.id);
        let roleRequestResult = await databaseManager.executeRequest(roleRequest);

        if(roleRequestResult.result.length){
            for(let j=0; j < roleRequestResult.result.length; j++){
                res.locals.backendProfileRoles[roleRequestResult.result[j].role] = true;
            }

        }

        return next();

    },


};
