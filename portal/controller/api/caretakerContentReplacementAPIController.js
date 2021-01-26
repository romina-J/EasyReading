let express = require('express');
let router = express.Router();
let databaseManager = require("../../../core/database/database-manager");
let ioType = rootRequire("core/IOtypes/iotypes");
const passport = require("passport");

router.use('/', async function (req, res, next) {

    if (req.method === "POST") {

        if (req.body.type === "userIsSignedIn") {
            res.json(JSON.stringify({
                type: "userIsSignedInResult",
                data: true,
            }));
        } else if (req.body.type === "replacementsForURL") {

            let result = await getReplacementsForURL(req.body.data.url, req.user.id);

            res.json(JSON.stringify({
                type: "replacements",
                data: result,
            }));
        } else if (req.body.type === "createOrUpdateReplacement") {
            try {


                let contentReplacement = req.body.data;

                if (contentReplacement.id) {
                    let request = databaseManager.createRequest("content_replacement").update(contentReplacement).where("id", "=", contentReplacement.id);
                    let updateRequest = await databaseManager.executeRequest(request);

                    let result = await getReplacementsForURL(contentReplacement.url, req.user.id);

                    res.json(JSON.stringify({
                        type: "createOrUpdateReplacementResult",
                        data: result,
                    }));
                } else {


                    contentReplacement.pid = req.user.id;
                    let request = databaseManager.createRequest("content_replacement").insert(contentReplacement);
                    let newContentReplacement = await databaseManager.executeRequest(request);

                    let result = await getReplacementsForURL(contentReplacement.url, req.user.id);

                    res.json(JSON.stringify({
                        type: "createOrUpdateReplacementResult",
                        data: result,
                    }));


                }
            } catch (e) {



                res.json(JSON.stringify({
                    type: "error",
                    data: e,
                }));
            }

        } else if (req.body.type === "deleteContentReplacement") {

            try{
                let contentReplacement = req.body.data;
                let request = databaseManager.createRequest("content_replacement").where("id", "=", contentReplacement.id).delete();
                let deleteRequest = await databaseManager.executeRequest(request);

                let result = await getReplacementsForURL(contentReplacement.url, req.user.id);

                res.json(JSON.stringify({
                    type: "deleteContentReplacementResult",
                    data: result,
                }));
            }catch (e) {
                res.json(JSON.stringify({
                    type: "error",
                    data: e,
                }));
            }

        }else {
            res.json(JSON.stringify({
                value: 1,
                type: {
                    x: 123,
                    y: 11
                }
            }));
        }


    }


});

async function getReplacementsForURL(url, pid) {



    /*
    if(url){
        if(url.charAt(url.length-1) == "/"){
            url = url.substring(0, url.length - 1)
        }
    }*/
 //   let loadActiveDOMHelperRequest = databaseManager.createRequest("content_replacement").where("url", "LIKE", url + "%");
    let loadActiveDOMHelperRequest = databaseManager.createRequest("content_replacement").where("url", "=", url);
    let loadActiveDOMHelperResult = await databaseManager.executeRequest(loadActiveDOMHelperRequest);
    let result = new ioType.IOTypes.ContentReplacement();
    if (loadActiveDOMHelperResult.result.length > 0) {
        for (let i = 0; i < loadActiveDOMHelperResult.result.length; i++) {
            if (loadActiveDOMHelperResult.result[i].pid === pid) {
                loadActiveDOMHelperResult.result[i].owner = true;
            }
            result.addReplacement("content_replacement", loadActiveDOMHelperResult.result[i]);
        }


    }

    return result;
}


module.exports = router;