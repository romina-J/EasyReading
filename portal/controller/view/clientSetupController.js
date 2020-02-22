module.exports = {
    setupController: async (req, res, next) => {


        let totalSteps = 7;
        let step = 1;
        if (req.session.step) {
            step = req.session.step;
        }else{
            req.session.setupInformation = [];
            for(let i=0; i < totalSteps-1; i++){
                req.session.setupInformation.push(0);
            }
        }


        if (step > 1) {

            switch (step) {
                case 2:
                    //Text easier to understand
                    req.session.setupInformation[0] =  {
                        easytext: req.body.easytext,
                        translation: req.body.translation,
                        video: req.body.video,

                    };

                    break;
                case 3:
                    req.session.setupInformation[1] =  {
                        preferred_symbol: req.body.preferred_symbol,
                    };
                    break;
                case 4:


                    req.session.setupInformation[2] =  {
                        colorize: req.body.colorize,
                        fonts: req.body.fonts,
                        links: req.body.links,
                        noads:req.body.noads,
                        reading:req.body.reading,

                    };
                    break;
                case 5:

                    req.session.setupInformation[3] =  {
                        tts: req.body.tts,
                        highlightning: req.body.highlightning,
                    };

                    break;
                case 6:

                    req.session.setupInformation[4] =  {
                        text_selection: req.body.text_selection,
                    };

                    break;
                case 7:
                    req.session.setupInformation[5] =  {
                        presentation: req.body.presentation,
                        user_interface: req.body.user_interface,
                    };




                    break;

                case 8:
                    delete req.session.setupInformation;
                    delete req.session.step;
                    res.redirect("/client/welcome");
                    return;

            }
        }

        res.locals.setupInformation = req.session.setupInformation;

        if (req.body.personalizedProfile) {

            step = 2;

        } else if (req.body.defaultProfile) {

            step = 8;

            res.locals.defaultProfile = true;

        } else if (req.body["next.x"]) {
            step++;
        } else if (req.body["back.x"]) {
            step--;
        }


        if(step === 8){
            let supportCategories = createSupportCategories(req,res);
          //  await saveSupportData(data,req.session.user.id);

            let automatedProfileCreator  = require("../../../core/profile/automated-profile-creator");

            await automatedProfileCreator.createConfigurationForSupportCategories(supportCategories,req.session.user.id);


    //        res.redirect("/client/welcome");
        }

        req.session.step = step;


        if (step > 0) {
            res.locals.previousStep = step - 1;
        }
        res.locals.currentStep = step;
        res.locals.nextStep = step + 1;


        let stepInformation = [];

        for (let i = 1; i < totalSteps; i++) {

            if (i + 1 < step) {
                stepInformation.push({
                    stepNumber: i,
                    step: "completedStep"
                });
            } else if (i + 1 === step) {
                stepInformation.push({
                    stepNumber: i,
                    step: "currentStep"
                });
                stepInformation.push("currentStep");
            } else {
                stepInformation.push({
                    stepNumber: i,
                    step: "upcomingStep"
                });

            }


        }


        res.locals.stepInformation = stepInformation;
        res.render('client_setup_step_' + step, res.locals.context);
        //   return next();
    }


};

let databaseManager = require("../../../core/database/database-manager");

/*
async function saveSupportData(data,pid) {



    let keys = [];
    Object.entries(data).forEach(([key, value]) => {
        keys.push(key);
    });

    for(let i=0; i < keys.length; i++){

        //Delete old stuff
        let deleteOldSupportDataRequest = databaseManager.createRequest("profile_"+keys[i]).where("pid", "=", pid).delete();
        await databaseManager.executeRequest(deleteOldSupportDataRequest);


        data[keys[i]].pid = pid;
        let insertNewDataRequest = databaseManager.createRequest("profile_"+keys[i]).insert(data[keys[i]]);
        let insertNewDataRequestResult = await databaseManager.executeRequest(insertNewDataRequest);

    }

};
*/



function createSupportCategories(req,res) {


    let profileBuilder = require("../../../core/profile/profile-builder");
    let supportCategories = profileBuilder.createDefaultSupportCategories(req.user.id);

    if(res.locals.defaultProfile){
        return supportCategories;
    }

    if(req.session.setupInformation){
        let setupInformation = req.session.setupInformation;

        //Understanding Support
        if(setupInformation[0].easytext){
            if(setupInformation[0].easytext === "true"){
                supportCategories.text_support.simplified_language.preference = 50;
            }else{
                supportCategories.text_support.simplified_language.preference = 0;
            }
        }

        if(setupInformation[0].translation){
            if(setupInformation[0].translation === "true"){
                supportCategories.text_support.translation.preference = 50;
            }else{
                supportCategories.text_support.translation.preference = 0;
            }
        }

        if(setupInformation[0].video){
            if(setupInformation[0].video === "true"){
                supportCategories.text_support.multimedia_annotation.preference = 50;
            }else{
                supportCategories.text_support.multimedia_annotation.preference = 0;
            }
        }

        //Symbol Support
        if(setupInformation[1].preferred_symbol !== ""){

            if(setupInformation[1].preferred_symbol === "none"){
                supportCategories.symbol_support.aac.preference = 0;
                supportCategories.symbol_support.aac.preferred_library = "none";
            }else{
                supportCategories.symbol_support.aac.preference = 50;
                supportCategories.symbol_support.aac.preferred_library = setupInformation[1].preferred_symbol;
            }
        }
        //Layout Support New
        if(setupInformation[2].fonts){
            if(setupInformation[2].fonts === "true"){
                supportCategories.layout_support.font_support.preference = 50;
            }else{
                supportCategories.layout_support.font_support.preference = 0;
            }
        }
        if(setupInformation[2].colorize){
            if (setupInformation[2].colorize === "true"){
                supportCategories.layout_support.color_support.preference = 50;
            }else{
                supportCategories.layout_support.color_support.preference = 0;
            }
        }
        if(setupInformation[2].reading){
            if(setupInformation[2].reading === "true"){
                supportCategories.layout_support.layout_support.preference = 50;
            }else{
                supportCategories.layout_support.layout_support.preference = 0;
            }
        }
        if(setupInformation[2].links){
            if(setupInformation[2].links === "true"){
                supportCategories.layout_support.link_support.preference = 50;
            }else{
                supportCategories.layout_support.link_support.preference = 0;
            }
        }
        if(setupInformation[2].noads){
            if(setupInformation[2].noads === "true"){
                supportCategories.layout_support.ad_support.preference = 50;
            }else{
                supportCategories.layout_support.ad_support.preference = 0;
            }
        }

        //Reading Support
        if(setupInformation[3].tts !== "" && setupInformation[3].tts !== "none"){
            supportCategories.reading_support.tts.preference = 50;
            supportCategories.reading_support.tts.speed = setupInformation[3].tts;
            if(setupInformation[3].highlightning !== "") {
                supportCategories.reading_support.tts.syntax_highlightning = (setupInformation[3].highlightning === "true");
            }
        }else{
            supportCategories.reading_support.tts.preference = 0;
        }

        //Input Support
        if(setupInformation[4].text_selection !== ""){

            if(setupInformation[4].text_selection === "click"){
                supportCategories.input.text_selection_click.preference = 50;
                supportCategories.input.text_selection_mark.preference = 0;
            }else if(setupInformation[4].text_selection === "mark"){
                supportCategories.input.text_selection_click.preference = 0;
                supportCategories.input.text_selection_mark.preference = 50;
            }

        }

        //Presentation support
        if(setupInformation[5].presentation){
            if(setupInformation[5].presentation === "tooltip"){
                supportCategories.output.tooltip.preference = 50;
                supportCategories.output.above_word.preference = 0;
                supportCategories.output.next_to_word.preference = 0;
            }else if(setupInformation[5].presentation === "top"){
                supportCategories.output.tooltip.preference = 0;
                supportCategories.output.above_word.preference = 50;
                supportCategories.output.next_to_word.preference = 0;

            }else if(setupInformation[5].presentation === "next"){
                supportCategories.output.tooltip.preference = 0;
                supportCategories.output.above_word.preference = 0;
                supportCategories.output.next_to_word.preference = 50;
            }

        }

        //User interface
        if(setupInformation[5].user_interface){
            if(setupInformation[5].user_interface === "overlay"){
                supportCategories.user_interface.overlay.preference = 50;
                supportCategories.user_interface.slide_in.preference = 0;
            }else{
                supportCategories.user_interface.overlay.preference = 0;
                supportCategories.user_interface.slide_in.preference = 50;
            }
        }
    }

    return supportCategories;



}