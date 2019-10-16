const profileRepo = require("../repository/profileRepo");

async function userLogin(req, loginInfo, callback) {

    let userProfile = {};
    let error = null;

    //Client side login(extension, apps)...
    if (req.session._clientToken) {

        let network = require("../../core/network/network");
        let webSocketConnection = network.getConnectionWithUUID(req.session._clientToken);
        if (webSocketConnection) {

            let password = require('password-hash-and-salt');
            await password(loginInfo.id).hash("this is my salt and not yours!!!", async function (error, hashedUserLoginID) {
                if (error) {
                    console.log(error);
                    return;
                }


                let clientProfile = require("../../core/profile/profile");
                let currentProfile = new clientProfile(req.session._clientToken);
                currentProfile.email = loginInfo.email;
                currentProfile.locale = loginInfo.locale;
                currentProfile.loginType = loginInfo.loginType;

                try {

                    if (loginInfo.loginType === "Facebook") {
                        await currentProfile.loginFacebook(hashedUserLoginID, currentProfile.email, webSocketConnection);

                    } else if (loginInfo.loginType === "Google") {
                        await currentProfile.loginGoogle(hashedUserLoginID, currentProfile.email, webSocketConnection);

                    } else if (loginInfo.loginType === "Anonym") {
                        await currentProfile.loginAnonym(hashedUserLoginID, currentProfile.email, webSocketConnection);
                    }
                    webSocketConnection.profile = currentProfile;
                    let loginResult = {
                        type: "userLoginResult",
                        result: currentProfile,
                    };
                    webSocketConnection.sendMessage(loginResult);
                    currentProfile.userId = currentProfile.googleID;

                    const userProfile = await profileRepo.getProfileByEmail(currentProfile.email);

                    callback(userProfile, error);


                } catch (e) {

                    console.log(e);
                    callback(userProfile, e);


                }


            });
        }


    } else {

        //Portal side login, Caretakers & Clients
        try {

            const healthCareWorkerProfile = await profileRepo.getProfileByEmail(loginInfo.email);

            if (healthCareWorkerProfile) {
                callback(healthCareWorkerProfile, error);
            } else {


                const profileData = {
                    email: loginInfo.email,
                    roles: ["caretaker"]
                };
                if (loginInfo.loginType === "Facebook") {

                } else if (loginInfo.loginType === "Google") {

                }
                const profileBuilder = require("../../core/profile/profile-builder");
                await profileBuilder.saveProfile(profileData, false);

                callback(profileData, error);

            }


        } catch (e) {
            console.log(e);
            callback(userProfile, e);

        }


    }


}


async function createRandomEmail() {

    const databaseManager = require("../../core/database/database-manager");
    let email = null;
    while (!email) {

        let newEmail = "anonym" + randomInt(1, 10000000) + "@easyreading.eu";

        let loadProfileRequest = databaseManager.createRequest("profile").where("email", "=", newEmail);

        let loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);


        if (loadProfileRequestResult.result.length === 0) {
            email = newEmail;
        }

    }

    return new Promise(function (resolve, reject) {
        resolve(email);
    });


}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}

async function createLoginInfoAnonym(req, uuid) {
    let randomEmail = await createRandomEmail();

    let locale = "en";
    if(req.query.lang){
        locale = req.query.lang;
    }
    return {
        loginType: "Anonym",
        id: uuid,
        email: randomEmail,
        locale: locale,
    };
}

async function createLoginInfoGoogle(req, profile) {

    let locale = "en";
    if (profile._json) {
        if (profile._json.language) {
            locale = profile._json.language;
        }
    }

    return {
        loginType: "Google",
        id: profile.id,
        email: profile.emails[0].value,
        locale: locale,
    }
}

async function createLoginInfoFacebook(req, profile) {

    return {
        loginType: "Facebook",
        id: profile.id,
        email: profile.emails[0].value,
        locale: "en",
    };
}

module.exports = {
    userLogin: userLogin,
    createLoginInfoAnonym: createLoginInfoAnonym,
    createLoginInfoGoogle: createLoginInfoGoogle,
    createLoginInfoFacebook: createLoginInfoFacebook,

};

