const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const profleRepo = require("../repository/profileRepo");
const config = require("../config/config");

passport.use(
    new googleStrategy({
        callbackURL: config.google.callbackURL,
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        scope: config.google.scope,
        passReqToCallback: true,
    }, async (req, accessToken, refreshToken, profile, done) => {


        //Client side login(extension, apps)...
        if(req.session._clientToken){

            profile._clientToken = req.session._clientToken;

            let network = require("../../core/network/network");
            let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);
            if(webSocketConnection){
                let password = require('password-hash-and-salt');


                password(profile.id).hash("this is my salt and not yours!!!",async function(error, hashedGoogleID) {
                    if (error){
                        console.log(error);
                        return;
                    }


                    let clientProfile = require("../../core/profile/profile");
                    let currentProfile = new clientProfile(req.session._clientToken);
                    currentProfile.email = profile.emails[0].value;

                    try {

                        await currentProfile.login(hashedGoogleID, webSocketConnection);
                        webSocketConnection.profile = currentProfile;
                        let loginResult = {
                            type: "userLoginResult",
                            result : currentProfile,
                        };
                        webSocketConnection.sendMessage(loginResult);
                        currentProfile.userId = currentProfile.googleID;

                        const ownProfileQueryResult = await profleRepo.getOwnProfileByEmail(currentProfile.email);
                        let ownProfile ={...ownProfileQueryResult.result[0]};

                         ownProfile.account = {
                                google:  profile
                            };
                            return done(null, ownProfile);

                        //return done(null, currentProfile);

                    }catch (error){

                        console.log(error);


                    }});
            }




        }else{

            const healthCareWorkerProfileQueryResult = await profleRepo.getHealthCareWorkerByEmail(profile.emails[0].value);


            if (healthCareWorkerProfileQueryResult.result.length > 0) {

                let healthCareWorkerProfile ={...healthCareWorkerProfileQueryResult.result[0]};

                healthCareWorkerProfile.account = {
                    google:  profile
                };

                return done(null, healthCareWorkerProfile);
            } else
            {
                const ownProfileQueryResult = await profleRepo.getOwnProfileByEmail(profile.emails[0].value);
                if (ownProfileQueryResult.result.length > 0) {

                    let ownProfile ={...ownProfileQueryResult.result[0]};

                    ownProfile.account = {
                        google:  profile
                    };
                    return done(null, ownProfile);
                } else {
                    //console.log(JSON.stringify(profile));
                    return done(`${profile.emails[0].value} is not registered health care worker or patient.`);
                }
            }

        }


    })
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;