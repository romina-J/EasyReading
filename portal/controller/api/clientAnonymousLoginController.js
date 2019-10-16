let express = require('express');
let router = express.Router();

const passport = require("passport");

router.get('/', function (req, res, next) {
    /*
    console.log(req.query.token);
    console.log(req.query.lang);
    console.log(req.session._clientToken);
    */
    if (req.query.token) {
        req.session.returnTo = "/client/welcome";
        req.session._clientToken = req.query.token;
        if (req.session._select_account) {

            passport.authenticate('anonymId', {
                    failureRedirect: '/client/login/anonym',
                    session: true
                }
            )(req, res, next);
        } else if (req.isAuthenticated()) {
            return res.redirect('/client/welcome');
            //   return next()
        } else {
            passport.authenticate('anonymId', {
                    failureRedirect: '/client/login/anonym',
                    session: true
                }
            )(req, res, next);
        }

    } else if (req.session._clientToken) {
        req.session.returnTo = "/client/welcome";
        if (req.session._select_account) {

            passport.authenticate('anonymId', {
                    failureRedirect: '/client/login/anonym',
                    session: true
                }
            )(req, res, next);
        } else {
            if (req.isAuthenticated()) {

                return res.redirect('/client/welcome');
                //return next()
            } else {
                passport.authenticate('anonymId', {
                        failureRedirect: '/client/login/anonym',
                        session: true
                    }
                )(req, res, next);
            }
            //passport.authenticate('google')(req,res,next);
            //  res.status(404).send('Not found');
        }

    } else {
        res.status(404).send('Not found');
    }


});

router.post('/', async function (req, res, next) {
    res.send({
        success: false,
    });

});


module.exports = router;