let express = require('express');
let router = express.Router();

const passport = require("passport");

router.use('/', async function(req,res,next){
    req.logout();
    req.session._select_account = true;


    let network = require("../../../core/network/network");
    let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);
    if(webSocketConnection){
        await webSocketConnection.logout();

    }

    if(req.session._clientToken){
        delete req.session._clientToken;
    }

    res.redirect('/');
});

module.exports = router;