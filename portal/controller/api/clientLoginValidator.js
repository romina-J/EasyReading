/** Express router providing client login related routes
 * @module routers/clientLoginValidator
 * @requires express
 */

let express = require('express');
let router = express.Router();
const passport = require("passport");

/**
 * Login in redirects after passport authenticate
 * @name use/
 * @memberof module:routers/clientLoginValidator
 * @param {Request} req Request object that is used for session to read values after passport authenticate
 * @param {Response} res Response object that is used to redirect after authenticate
 * @param next Next object that just is returned
 */
router.use('/', async function(req, res, next){
    if (req.method === "GET") {
        //User tries to log in...
        if(req.originalUrl.startsWith("/client/login")) {

            let token = null;
            if(req.query.token) {
                token = req.query.token;
            }else if(req.session._clientToken){
                token = req.session._clientToken;
            }

            //Check if token is valid
            if (token) {
                const network = require("../../../core/network/network");

                //Check if token is valid
                if (network.getConnectionWithUUID(token)) {
                    req.session._clientToken =token;

                    return next();
                } else {
                    //Token not valid

                    //Check if the user is signed in with the extension or just as a carer
                    if(req.isAuthenticated()) {

                        if(req.session._clientToken){
                            if (network.getConnectionWithUUID(req.session._clientToken)) {
                                //User is logged in and has a valid websocket connection
                                return res.redirect('/client/welcome');

                            }else{
                                //User is logged in but has no valid websocket connection. This should never happen.

                                console.log("ERROR: user logged in with no valid websocket connection");
                            }
                        }else{
                            //Carer tries to login over client way without using the extension... redirect him to origin.
                            return res.redirect('/');
                        }
                    }else{
                        console.log("Error: unauthorized user without token tried to login as client");
                    }
                }
            }

            //Return forbidden
            return res.sendStatus(403);
        }
        else if(req.originalUrl.startsWith("/login") || req.originalUrl.startsWith("/caretaker/login")) {
            //Check if the user is signed in with the extension or just as a carer
            if(req.isAuthenticated()) {

                if(req.session._clientToken){
                    //Client logged in with extension
                    return res.redirect('/client/welcome');
                }else{
                    //Caretaker already logged in
                    return res.redirect('/');
                }
            }

        }
    }else{
        if(req.isAuthenticated()) {


            let databaseManager = require("../../../core/database/database-manager");
            let loadProfileRoleRequest = databaseManager.createRequest("role").where("user_id", "=", req.user.id);
            let loadProfileRoleRequestResult = await databaseManager.executeRequest(loadProfileRoleRequest);
            if(loadProfileRoleRequestResult.result.length === 0){
                req.session.destroy(function(err) {
                    console.log("Destroying session");
                    if(err){
                        console.log(err);
                    }
                });

                res.send({
                    success: false,
                });

                return;

            }
        }

    }

    return next();
});

module.exports = router;