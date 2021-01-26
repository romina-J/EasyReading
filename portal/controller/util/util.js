let localeService = require("../../../core/i18n/locale-service");
let databaseManager = require("../../../core/database/database-manager");
let util = {

    getProfile:async function(pid){
        let profileRequest = databaseManager.createRequest("profile").where("id","=",pid);
        let profileRequestResult = await databaseManager.executeRequest(profileRequest);

        if(profileRequestResult.result.length){


            return profileRequestResult.result[0]

        }

    },
    getRolesOfProfile: async function(profile){
        let roleRequest = databaseManager.createRequest("role").where("user_id","=",profile.id);
        let roleRequestResult = await databaseManager.executeRequest(roleRequest);

        let roles = [];
        for(let i=0; i< roleRequestResult.result.length; i++){
            roles.push(roleRequestResult.result[i].role);
        }

        if(profile.email === "peter.heumader@gmail.com"){
            roles.push("admin");
        }

        return roles;

    },


    createRoleString:function(roles,locale){
        let translatedRoles = [];
        for(let i=0; i  < roles.length; i++){
            translatedRoles.push(localeService.translate({
                phrase: roles[i]+"_role_text",
                locale: locale
            }));
        }


        let roleInformation = "";
        for(let i=0; i <translatedRoles.length; i++){

            if(i > 0){
                roleInformation+=", ";
            }
            roleInformation+=translatedRoles[i];

        }

        return roleInformation;
    },
    deleteBackendUser: async function(id){

        let deleteRequest = databaseManager.createRequest("embedded_site").where("esm_id","=",id).delete();
        let deleteRequestResult = await databaseManager.executeRequest(deleteRequest);

        let profileRequest = databaseManager.createRequest("embedded_site_manager_profile").where("esm_id","=",id);
        let profileRequestResult =  await databaseManager.executeRequest(profileRequest);
        if(profileRequestResult.result.length){
            let profileBuilder = require("../../../core/profile/profile-builder");
            for(let i=0; i < profileRequestResult.result.length; i++){
                await profileBuilder.deleteProfile(profileRequestResult.result[i]);
            }
        }

        deleteRequest = databaseManager.createRequest("embedded_site_manager_profile").where("esm_id","=",id).delete();
        deleteRequestResult = await databaseManager.executeRequest(deleteRequest);

        deleteRequest = databaseManager.createRequest("content_replacement").where("pid","=",id).delete();
        deleteRequestResult = await databaseManager.executeRequest(deleteRequest);

        deleteRequest = databaseManager.createRequest("client_carer_relation").where("carer_id","=",id).delete();
        deleteRequestResult = await databaseManager.executeRequest(deleteRequest);


    },

    deleteClient: async function(id){

        let profileBuilder = require("../../../core/profile/profile-builder");
        await profileBuilder.deleteProfile({id:id});

    }


};

module.exports = util;