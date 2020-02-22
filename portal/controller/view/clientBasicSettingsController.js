let express = require('express');
let router = express.Router();
const core = rootRequire("core/core");

router.use('/', async function (req, res, next) {

    let errorMessages = [];
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


        let databaseManager = require("../../../core/database/database-manager");
        let updateProfileRequest = databaseManager.createRequest("profile").update(req.session.user).where("id", "=", req.session.user.id);
        let updateProfileRequestResult = await databaseManager.executeRequest(updateProfileRequest);



        /*
        errorMessages.push({
            message: "user_not_found",
            additionalInfo:req.body.email
        });*/
        res.redirect(req.originalUrl);
        return;


    }
    let localeServices = require("../../../core/i18n/locale-service");
    let supportedLanguages = localeServices.getLocales();
    let i18n = require("i18n");

    res.locals.supportedLanguages = [];

    let userLocale = req.session.user.locale.split("_")[0];
    for (let i = 0; i < supportedLanguages.length; i++) {

        let translatedLabel = i18n.__({
            phrase: 'language_label_' + supportedLanguages[i],
            locale: userLocale
        });

        res.locals.supportedLanguages.push({
            id: supportedLanguages[i],
            label: translatedLabel,
            userLanguage: (userLocale === supportedLanguages[i]),
        });

    }

    res.locals.ui_mode = req.session.user.ui_mode;

    res.locals.errorMessages = errorMessages;


    return next();
});

module.exports = router;