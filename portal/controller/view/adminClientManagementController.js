let databaseManager = require("../../../core/database/database-manager");

/** User module
 * @module user
 * @requires express
 */

module.exports = {


    clientManagement: async (req, res, next) => {

        res.locals.profiles = [];


        let clientUserRequest = databaseManager.createRequest("role").where("role", "=", "client");
        let clientUserRequestResult = await databaseManager.executeRequest(clientUserRequest);

        let embeddedClientRequest = databaseManager.createRequest("role").where("role", "=", "embedded");
        let embeddedClientRequestResult = await databaseManager.executeRequest(embeddedClientRequest);

        if (clientUserRequestResult.result.length) {
            for (let i = 0; i < clientUserRequestResult.result.length; i++) {

                let embeddedClient = false;
                for (let k = 0; k < embeddedClientRequestResult.result.length; k++) {

                    if (clientUserRequestResult.result[i].user_id === embeddedClientRequestResult.result[k].user_id) {
                        embeddedClient = true;
                        break;
                    }
                }

                if (!embeddedClient) {
                    let profileRequest = databaseManager.createRequest("profile").where("id", "=", clientUserRequestResult.result[i].user_id);
                    let profileRequestResult = await databaseManager.executeRequest(profileRequest);

                    if (profileRequestResult.result.length) {

                        res.locals.profiles.push(profileRequestResult.result[0]);
                    }
                }


            }

        }


        return next();
    },

    clientDelete: async (req, res, next) => {

        let userLocale = req.locale;
        if (req.session.user.locale) {
            userLocale = req.session.user.locale.split("_")[0];
        }

        let util = require("../util/util");

        let profile = await util.getProfile(req.query.id);
        let roles = await util.getRolesOfProfile(profile);
        res.locals.userInformation = util.createRoleString(roles, userLocale);

        if (roles.includes("backend_user")) {
            res.locals.backendUser = true;
        }

        if (req.method === "POST") {

            if (req.body.delete_backend_user) {

                await util.deleteBackendUser(req.query.id);

            }

            await util.deleteClient(req.query.id);
            if(res.locals.backendUser || ! roles.includes("backend_user")){

                let deleteProfileRequest = databaseManager.createRequest("profile").where("id", "=", req.query.id).delete();
                let deleteProfileRequestResult = await databaseManager.executeRequest(deleteProfileRequest);

            }

            let network = require("../../../core/network/network");
            network.kickConnectionsWithID(req.query.id);


            res.redirect('/admin/client_management');
            return;

        }




        return next();

    },


};
