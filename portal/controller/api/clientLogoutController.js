let express = require('express');
let router = express.Router();

const passport = require("passport");

router.use('/', async function(req,res,next){

    req.session._select_account = true;

    //If user is still logged in
    if(req.user){

        //If user is logged in as client
        if(req.user.clientLogin){
            let network = require("../../../core/network/network");
            let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);
            if(req.session._clientToken){
                delete req.session._clientToken;
            }

            req.logout();

            if(webSocketConnection){
                await webSocketConnection.logout();
            }
            res.redirect("/logout-success");


            //If user is logged in as caretaker
        }else{
            req.logout();
            res.redirect('/');
        }

    }else{
        //Redirect user to caretaker start page
        res.redirect('/');
    }





});

module.exports = router;