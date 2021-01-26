/** Express router providing client welcome route
 * @module routers/clientWelcomeViewController
 * @requires express
 */

let express = require('express');
let router = express.Router();

const passport = require("passport");

/**
 * Route serving client welcome page.
 * @name use/
 * @memberof module:routers/clientWelcomeView
 * @param {Request} req Not used
 * @param {Response} res Not used
 * @param next Returns the view
 */
router.use('/', function(req,res,next){
    return next();
});

module.exports = router;