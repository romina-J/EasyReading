/** User module
 * @module user
 * @requires express
 */

module.exports = {

    overview: async (req, res, next) => {

        let databaseManager = require("../../../core/database/database-manager");
        let profileRequest = databaseManager.createRequest("embedded_site_manager_profile");
        let profileRequestResult = await databaseManager.executeRequest(profileRequest);
        if(profileRequestResult.result.length){
            res.locals.profiles = profileRequestResult.result;
            res.locals.profileCreated = true;
        }else{
            res.locals.profiles = [];
            res.locals.profileCreated = false;
        }




        let sitesRequest = databaseManager.createRequest("embedded_site");
        let sitesRequestResult = await databaseManager.executeRequest(sitesRequest);
        if(sitesRequestResult.result.length){
            for(let i=0;i < sitesRequestResult.result.length; i++){

                for(let j=0; j < res.locals.profiles.length; j++){

                    if(sitesRequestResult.result[i].pid === res.locals.profiles[j].id){
                        sitesRequestResult.result[i].profileTitle = res.locals.profiles[j].title;
                        res.locals.profiles[j].used = true;
                        break;
                    }
                }

            }

            res.locals.sites = sitesRequestResult.result;
        }else{
            res.locals.sites = [];
        }




        return next();
    }

    ,
    editSite: async (req, res, next) => {
        let databaseManager = require("../../../core/database/database-manager");
        if(req.query.id){
            let embeddedSiteRequest = databaseManager.createRequest("embedded_site").where("id", "=",req.query.id);
            let embeddedSiteRequestResult = await databaseManager.executeRequest(embeddedSiteRequest);

            if(embeddedSiteRequestResult.result.length){
                res.locals.id  = embeddedSiteRequestResult.result[0].id;
                res.locals.title  = embeddedSiteRequestResult.result[0].title;
                res.locals.url  = embeddedSiteRequestResult.result[0].url;
                res.locals.esm_id  = embeddedSiteRequestResult.result[0].esm_id;
                res.locals.pid  = embeddedSiteRequestResult.result[0].pid;

            }

            let profileRequest = databaseManager.createRequest("embedded_site_manager_profile").where("esm_id", "=",res.locals.esm_id);
            let profileRequestResult = await databaseManager.executeRequest(profileRequest);
            if(profileRequestResult.result.length){
                res.locals.profiles = profileRequestResult.result;
            }else{
                res.locals.profiles = [];
            }

        }



        if (req.method === "POST") {
            let data = {
                title: req.body.title,
                url: req.body.url,
                pid: req.body.profile,
                esm_id: req.session.user.id,
            };

            if(req.body.id){
                data.id = req.body.id;
                data.esm_id = req.body.esm_id;
            }

            let request = databaseManager.createRequest("embedded_site").insertOrUpdate(data);

            let requestResult = await databaseManager.executeRequest(request);



            res.redirect('/admin/embedded_sites');
            return;
        }

        return next();


    },

    editProfile: async (req, res, next) => {

        let databaseManager = require("../../../core/database/database-manager");

        if(req.query.id){
            let embeddedSiteProfileRequest = databaseManager.createRequest("embedded_site_manager_profile").where("id", "=",req.query.id);
            let embeddedSiteProfileRequestResult = await databaseManager.executeRequest(embeddedSiteProfileRequest);

            if(embeddedSiteProfileRequestResult.result.length){
                res.locals.id  = embeddedSiteProfileRequestResult.result[0].id;
                res.locals.title  = embeddedSiteProfileRequestResult.result[0].title;
                res.locals.esm_id  = embeddedSiteProfileRequestResult.result[0].esm_id;
                res.locals.pid  = embeddedSiteProfileRequestResult.result[0].pid;
            }


        }
        if (req.method === "POST") {

            let pid= -1;
            if(!req.body.id){
                let localeService = require("../../../core/i18n/locale-service");
                let clientProfile = require("../../../core/profile/profile");
                let currentProfile = new clientProfile("0");
                currentProfile.email = await createRandomEmail();
                currentProfile.locale = localeService.getSupportedLanguage("de");
                currentProfile.loginType = "Embedded";

                await currentProfile.loginEmbedded(currentProfile.email, null);
                pid = currentProfile.id;
            }else{
                let getEmbeddedSiteManagerProfileRequest = databaseManager.createRequest("embedded_site_manager_profile").where("id", "=",req.body.id);
                let getEmbeddedSiteManagerProfileRequestResult = await databaseManager.executeRequest(getEmbeddedSiteManagerProfileRequest);

                if(getEmbeddedSiteManagerProfileRequestResult.result.length){
                    pid = getEmbeddedSiteManagerProfileRequestResult.result[0].pid;
                }else{

                    console.log("No profile found for given id!");
                    return;
                }

            }


            let data = {
                title: req.body.title,
                pid: pid,
                esm_id: req.session.user.id,
            };
            if(req.body.id){
                data.esm_id = req.body.esm_id;
                data.id = req.body.id;
            }else{

            }

            let request = databaseManager.createRequest("embedded_site_manager_profile").insertOrUpdate(data);

            let requestResult = await databaseManager.executeRequest(request);

            res.redirect('/embedded/embeddedOverview');
            return;

        }

        return next();
    },
    deleteProfile: async (req, res, next) => {
        let id = 0;
        for (let element in req.body) {
            if (element.startsWith("delete_")) {
               id = element.replace("delete_", "");
            }
        }
        if(id){
            let databaseManager = require("../../../core/database/database-manager");
            let request = databaseManager.createRequest("embedded_site_manager_profile").where("id","=",id);
            let requestResult = await databaseManager.executeRequest(request);
            let profileBuilder = require("../../../core/profile/profile-builder");

            if(requestResult.result.length){
                await profileBuilder.deleteProfile({id:requestResult.result[0].pid});
            }

            request = databaseManager.createRequest("embedded_site_manager_profile").where("id","=",id).delete();
            requestResult = await databaseManager.executeRequest(request);


        }

        return res.redirect('/admin/embedded_sites');
    },
    deleteSite: async (req, res, next) => {
        let id = 0;
        for (let element in req.body) {
            if (element.startsWith("delete_")) {
                id = element.replace("delete_", "");
            }
        }

        if(id){
            let databaseManager = require("../../../core/database/database-manager");
            let embeddedSiteRequest = databaseManager.createRequest("embedded_site").where("id", "=",id).delete();
            let embeddedSiteRequestResult = await databaseManager.executeRequest(embeddedSiteRequest);
        }

        return res.redirect('/admin/embedded_sites');

    },


};

async function createRandomEmail() {
    let databaseManager = require("../../../core/database/database-manager");
    let email = null;
    while (!email) {

        let newEmail = "embedded_" + Math.floor(Math.random() * (1 - 10000000) + 1) + "@embedded-er.eu";
        let loadProfileRequest = databaseManager.createRequest("profile").where("email", "=", newEmail);
        let loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);

        if (loadProfileRequestResult.result.length === 0) {
            email = newEmail;
        }
    }

    return new Promise(function (resolve, reject) {
        resolve(email);
    });
}