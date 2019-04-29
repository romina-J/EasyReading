let express = require('express');
let router = express.Router();

const passport = require("passport");

router.use('/', function(req,res,next){
    req.logout();
    req.session._select_account = true;


    let network = require("../../../core/network/network");
    let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);
    if(webSocketConnection){
        webSocketConnection.logout();

    }
    res.send("Logging out ...");



});



module.exports = router;