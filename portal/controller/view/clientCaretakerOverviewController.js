let express = require('express');
let router = express.Router();
const core = rootRequire("core/core");

router.use('/', async function (req, res, next) {
    let databaseManager = require("../../../core/database/database-manager");
    if (req.method === "POST") {

        let careTakersToRemove = Object.keys(req.body);
        for(let i=0; i < careTakersToRemove.length; i++){

            let caretakerID = careTakersToRemove[i].split("_")[1];

            let deleteExistingClientCarerRelationShipRequest = databaseManager.createRequest("client_carer_relation").where("client_id","=",req.user.id).where("carer_id","=",caretakerID).delete();
            await databaseManager.executeRequest(deleteExistingClientCarerRelationShipRequest);

        }

    }

    let loadExistingClientCarerRelationsRequest = databaseManager.createRequest("client_carer_relation").where("client_id","=",req.user.id);
    let loadExistingClientCarerRelationsResult = await databaseManager.executeRequest(loadExistingClientCarerRelationsRequest);

    let profileRepo = require("../../repository/profileRepo");

    let existingClientCarerRelations = [];
    for(let i=0; i < loadExistingClientCarerRelationsResult.result.length; i++){

        let carerProfile = await profileRepo.getProfileId(loadExistingClientCarerRelationsResult.result[i].carer_id);

        if(carerProfile){
            existingClientCarerRelations.push({
                email: carerProfile.email,
                id: carerProfile.id,
            });
        }
    }

    res.locals.existingClientCarerRelations = existingClientCarerRelations;


    return next();
});

module.exports = router;