/** Express router providing caretaker related routes
 * @module routers/caretakerWelcomeView
 * @requires express
 */

let express = require('express');
let router = express.Router();
let databaseManager = require("../../../core/database/database-manager");

/**
 * Route serving caretaker welcome page.
 * @name use/
 * @memberof module:routers/caretakerWelcomeView
 * @param {Request} req Request object that includes the unique UserId
 * @param {Response} res Not used
 * @param next Returns the response object
 */
router.use('/', async function (req, res, next) {
    if (req.method === "POST") {
        try {
            if (req.body.upgrade) {
                if (req.body.upgrade[0] === "yes") {

                    if (!req.user.roles.includes("backend_user")) {
                        let saveRoleRequest = databaseManager.createRequest("role").insert({
                            user_id: req.user.id,
                            role: "backend_user"
                        });
                        await databaseManager.executeRequest(saveRoleRequest);
                        req.user.roles.push("backend_user");
                    }

                    if (!req.user.roles.includes("caretaker")) {
                        let saveRoleRequest = databaseManager.createRequest("role").insert({
                            user_id: req.user.id,
                            role: "caretaker"
                        });
                        await databaseManager.executeRequest(saveRoleRequest);
                        req.user.roles.push("caretaker");
                    }


                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    next();
});

module.exports = router;