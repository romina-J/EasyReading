/** Express router providing client login related routes
 * @module routers/clientFacebookLogin
 * @requires express
 */

let express = require('express');
let router = express.Router();
const passport = require("passport");

/**
 * Login in through Facebook with passport
 * @name get/
 * @memberof module:routers/clientAnonymousLogin
 * @param {Request} req Request object that is used for session values for passport authenticate
 * @param {Response} res Response object that is used in passport authenticate
 * @param next Next object that is used in passport authenticate
 */
router.get('/', function (req, res, next) {
    console.log(req.query.token);
    console.log(req.session._clientToken);
    if (req.query.token) {
        req.session.returnTo = "/client/welcome";
        req.session._clientToken = req.query.token;
        passport.authenticate('facebook', {
            failureRedirect: '/client/login',
            scope: ['email', 'public_profile'],
            authType: "reauthenticate"
        })(req, res, next);

    } else if (req.session._clientToken) {
        req.session.returnTo = "/client/welcome";
        passport.authenticate('facebook', {
            failureRedirect: '/client/login',
            scope: ['email', 'public_profile'],
            authType: "reauthenticate"
        })(req, res, next);

    } else {
        res.status(404).send('Not found');
    }
});

/**
 * Login in through Facebook with passport
 * @name post/
 * @memberof module:routers/clientAnonymousLogin
 * @param {Request} req Request object that is used for session values for passport authenticate
 * @param {Response} res Response object that is used in passport authenticate
 * @param next Not used
 */
router.post('/', async function (req, res, next) {
    if(req.isAuthenticated() && req.query.token) {
        req.session._clientToken = req.query.token;

        let passportLogin = require("../../passport/passportLogin");

        let loginInfo = await passportLogin.createLoginInfoFacebook(req, req.session._clientToken);
        await passportLogin.userLogin(req, loginInfo, function (profile, error) {

            if (profile) {
                res.send({
                    success: true,
                });

            } else {
                res.send({
                    success: false,
                });
            }
        });
    }else{
        res.send({
            success: false,
        });
    }
});

module.exports = router;