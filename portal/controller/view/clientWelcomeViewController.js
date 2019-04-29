let express = require('express');
let router = express.Router();

const passport = require("passport");

router.use('/', function(req,res,next){


    res.locals.user  = req.user;


    return next();

});

module.exports = router;