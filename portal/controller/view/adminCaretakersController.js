/** User module
 * @module user
 * @requires express
 */

module.exports = {

    cartakersOverview: async (req, res, next) => {

        let databaseManager = require("../../../core/database/database-manager");
        let profileRequest = databaseManager.createRequest("embedded_site_manager_profile").where("esm_id", "=",req.session.user.id);
        let profileRequestResult = await databaseManager.executeRequest(profileRequest);
        if(profileRequestResult.result.length){
            res.locals.profiles = profileRequestResult.result;
        }else{
            res.locals.profiles = [];
        }


        let sitesRequest = databaseManager.createRequest("embedded_site").where("esm_id", "=",req.session.user.id);
        let sitesRequestResult = await databaseManager.executeRequest(sitesRequest);
        if(sitesRequestResult.result.length){
            res.locals.sites = sitesRequestResult.result;
        }else{
            res.locals.sites = [];
        }



        return next();
    }

    ,
    createEditSite: async (req, res, next) => {
        let databaseManager = require("../../../core/database/database-manager");
        let profileRequest = databaseManager.createRequest("embedded_site_manager_profile").where("esm_id", "=",req.session.user.id);
        let profileRequestResult = await databaseManager.executeRequest(profileRequest);
        if(profileRequestResult.result.length){
            res.locals.profiles = profileRequestResult.result;
        }else{
            res.locals.profiles = [];
        }

        if (req.method === "POST") {

            let request = databaseManager.createRequest("embedded_site").insert({
                title: req.body.title,
                url: req.body.url,
                pid: req.body.profile,
                esm_id: req.session.user.id,
            });

            let requestResult = await databaseManager.executeRequest(request);



            res.redirect('/caretaker/embeddedOverview');
            return;
        }

        return next();


    },

    createEditProfile: async (req, res, next) => {

        if (req.method === "POST") {

            req.user.email


            let databaseManager = require("../../../core/database/database-manager");
            let localeService = require("../../../core/i18n/locale-service");
            let clientProfile = require("../../../core/profile/profile");
            let currentProfile = new clientProfile("0");
            currentProfile.email = await createRandomEmail();
            currentProfile.locale = localeService.getSupportedLanguage("de");
            currentProfile.loginType = "Embedded";
            await currentProfile.loginEmbedded(currentProfile.email, null);


            let request = databaseManager.createRequest("embedded_site_manager_profile").insert({
                title: req.body.title,
                pid: currentProfile.id,
                esm_id: req.session.user.id,
            });

            let requestResult = await databaseManager.executeRequest(request);

            res.redirect('/caretaker/embeddedOverview');
            return;

        }

        return next();
    }


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