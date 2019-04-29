let express = require('express');
let router = express.Router();

const passport = require("passport");

router.get('/', function(req,res,next){
    console.log(req.query.token);
    console.log(req.session._clientToken);
    if(req.query.token){
        req.session.returnTo = "/client/welcome";
        req.session._clientToken = req.query.token;
        if(req.session._select_account){

            passport.authenticate('google', { prompt: 'select_account', failureRedirect: '/client/login', })(req,res,next);
        }else if (req.isAuthenticated()) {
            return res.redirect('/client/welcome');
         //   return next()
        }else{
            passport.authenticate('google')(req,res,next);
        }

    }else if(req.session._clientToken){
        req.session.returnTo = "/client/welcome";
        if(req.session._select_account){

            passport.authenticate('google', { prompt: 'select_account', failureRedirect: '/client/login', })(req,res,next);
        }else{
            if (req.isAuthenticated()) {

                return res.redirect('/client/welcome');
                //return next()
            }else{
                passport.authenticate('google')(req,res,next);
            }
            //passport.authenticate('google')(req,res,next);
          //  res.status(404).send('Not found');
        }

    }else{
        res.status(404).send('Not found');
    }


});

router.post('/',async function(req,res,next){
    if(req.query.token){
        req.session._clientToken = req.query.token;

        if(!req.session._select_account){
            if (req.isAuthenticated()) {

                //Client side login(extension, apps)...
                if(req.session._clientToken){

                    let network = require("../../../core/network/network");
                    let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);
                    if(webSocketConnection){
                        let clientProfile = require("../../../core/profile/profile");
                        let currentProfile = new clientProfile(req.session._clientToken);
                        try {

                            await currentProfile.login(req.user.googleID, webSocketConnection);
                            webSocketConnection.profile = currentProfile;
                            let loginResult = {
                                type: "userLoginResult",
                                result : currentProfile,
                            };
                            webSocketConnection.sendMessage(loginResult);
                            res.send( {
                                success: true,
                            });

                            return;

                        }catch (error){
                            errorMsg = error;


                        }
                    }

                }

            }
        }
    }

    res.send( {
        success: false,
    });

});



module.exports = router;