let express = require('express');
let router = express.Router();
const core = rootRequire("core/core");

router.use('/', async function (req, res, next) {

    let errorMessages = [];
    let rUtil = rootRequire("core/user_tracking/reasoner-utils");
    let supportedModels = rUtil.models;

    if (req.method === "POST") {

        if (req.body.user_language) {

            req.session.user.locale = req.body.user_language;
        }

        if(req.body.ui_mode) {

            if(req.session.user.ui_mode !== req.body.ui_mode){

                let network = require("../../../core/network/network");
                let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);

                if(webSocketConnection){
                    if(req.body.ui_mode === "adaptable"){
                        webSocketConnection.stopAdaptivity();
                    }else{
                        webSocketConnection.startAdaptivity();
                    }

                }else{
                    console.log("error - could not locate websocket connection!");
                }

            }
            req.session.user.ui_mode = req.body.ui_mode;

        }

        try {
            if (req.body.reasoner_on && req.body.reasoner_model) {
                let user_reasoners = await rUtil.loadProfileReasoner(req.session.user, 'all', false, false);
                let network = require("../../../core/network/network");
                let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);
                if (req.body.reasoner_on === 'enabled') {
                    if (user_reasoners.length <= 0) {
                        await rUtil.createNewUserReasoner(req.session.user, req.body.reasoner_model);
                    } else {
                        await rUtil.enableReasonerForUser(req.session.user, req.body.reasoner_model);
                    }
                    if (webSocketConnection) {
                        let reasoner_data = await rUtil.loadProfileReasoner(req.session.user, 'enabled', true, false);
                        webSocketConnection.sendMessage({
                            type: "userReasoner",
                            reasoner_data: JSON.stringify(reasoner_data[0]),
                        });
                    }
                } else {
                    if (user_reasoners.length > 0) {
                        await rUtil.disableUserReasoners(req.session.user);
                    }
                    if (webSocketConnection) {
                        webSocketConnection.sendMessage({
                            type: "disableReasoner",
                        });
                    }
                }
            }
        } catch (e) {
            console.log('Error handling reasoner: ' + e);
        }

        let databaseManager = require("../../../core/database/database-manager");
        let updateProfileRequest = databaseManager.createRequest("profile").update(req.session.user).where("id", "=", req.session.user.id);
        let updateProfileRequestResult = await databaseManager.executeRequest(updateProfileRequest);

        res.redirect(req.originalUrl);
        return;

    }
    let localeService = require("../../../core/i18n/locale-service");
    let supportedLanguages = localeService.getLocales();

    res.locals.supportedLanguages = [];

    let userLocale = req.session.user.locale.split("_")[0];
    for (let i = 0; i < supportedLanguages.length; i++) {
        let translatedLabel = localeService.translate({
            phrase: 'language_label_' + supportedLanguages[i],
            locale: userLocale
        });

        res.locals.supportedLanguages.push({
            id: supportedLanguages[i],
            label: translatedLabel,
            userLanguage: (userLocale === supportedLanguages[i]),
        });

    }

    res.locals.reasoner_on = "disabled";
    let userModels = await rUtil.loadProfileReasoner(req.session.user, 'enabled', false, false);
    let userModel = '';
    if (userModels.length > 0) {
        userModel = userModels[0].model_type;
        res.locals.reasoner_on = "enabled";
    } else if (supportedModels.length > 0) {
        userModel = supportedModels[0];
    }

    res.locals.supportedModels = [];

    for (let i=0; i<supportedModels.length; i++) {
        let translatedLabel = localeService.translate({
            phrase: 'reasoner_model_' + supportedModels[i],
            locale: userLocale
        });
        res.locals.supportedModels.push({
            id: supportedModels[i],
            label: translatedLabel,
            userModel: (userModel === supportedModels[i]),
        });
    }

    res.locals.ui_mode = req.session.user.ui_mode;

    res.locals.errorMessages = errorMessages;


    return next();
});

module.exports = router;