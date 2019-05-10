const {OAuth2Client} = require('google-auth-library');
const CHROME_CLIENT_ID = "691784987953-qc6ohlnk2n6g38ea7mugvbgcfcpar6g6.apps.googleusercontent.com";
const FIREFOX_CLIENT_ID = "691784987953-2t52gjtb395j4ore0lel1526o5nboefd.apps.googleusercontent.com";
const IOS_CLIENT_ID = "584464554129-3vsvg5igvdh7cfsc0prjkjpikq7nqd1s.apps.googleusercontent.com";
const client = new OAuth2Client(CHROME_CLIENT_ID);
const uuidV4 = require('uuid/v4');

class WebSocketConnection {
    constructor(ws, url) {
        this.loggedIn = false;
        this.ws = ws;
        this.url = url;
        this.uuid = uuidV4();
        this.profile = null;
        console.log("Base URL:", url);
        const webSocketConnection = this;


        ws.on('message', function incoming(msg) {
            webSocketConnection.messageReceived(msg);
        });
        ws.on('close', function close() {
            webSocketConnection.connectionClosed();
        });


    }

    async messageReceived(msg) {



        let errorMsg = null;

        try {

            if(typeof msg === 'object'){
                return;
            }

            let req = JSON.parse(msg);
            if(req.type !== "ping"){
                console.log("Message received:");
                console.log(msg);
            }

            if (req.type === "userLogin") {
                //Just send default profile back

                if (typeof req.data.google_id_token !== "undefined") {

                    try {
                        /*get user google id:*/
                        let userInfo = await this.verify(req.data.google_id_token);

                        let password = require('password-hash-and-salt');
                        let webSocketConnection = this;

                        password(userInfo.googleId).hash("this is my salt and not yours!!!", async function (error, hashedGoogleID) {
                            if (error) {
                                console.log(error);
                                return;
                            }


                            let profile = require("./../profile/profile");
                            let currentProfile = new profile(webSocketConnection.uuid);
                            currentProfile.email = userInfo['email'];

                            try {
                                await currentProfile.login(hashedGoogleID, webSocketConnection);
                                webSocketConnection.profile = currentProfile;
                                req.type = "userLoginResult";
                                req.result = currentProfile;
                                webSocketConnection.sendMessage(req);

                            } catch (error) {
                                errorMsg = error;


                            }

                            return new Promise(function (resolve, reject) {
                                if (errorMsg) {
                                    console.log(errorMsg);
                                    reject(errorMsg);
                                } else {
                                    resolve();
                                }

                            });


                        });

                    } catch (error) {
                        errorMsg = error;
                    }

                    return new Promise(function (resolve, reject) {

                        if (errorMsg) {
                            console.log(errorMsg);
                            reject(errorMsg);
                        } else {
                            resolve();
                        }

                    });
                }


            } else if (req.type === "cloudRequest") {

                let core = rootRequire("./core/core");

                let config = this.profile.getConfigurationForFunction(req);

                //TODO Check if profile has this function....

                core.executeRequest(this, req, config);


            } else if (req.type === "getUUID") {

                this.redirectURL = req.redirectURL;
                this.sendMessage({
                    type: "getUUIDResult",
                    result: this.uuid,
                });

            }
            //Testing mobile client without Google Login
            else if (req.type === "mobileTestLogin") {
                let profile = require("./../profile/profile");
                let profileBuilder = require("./../profile/profile-builder");
                let currentProfile = new profile();
                profileBuilder.loadDefaultProfile(currentProfile);
                this.profile = currentProfile;

                profileBuilder.createClassMappings(currentProfile);

                if (!currentProfile.debugMode) {
                    profileBuilder.normalizeCSSPaths(currentProfile, this.url);
                }
                profileBuilder.normalizeIconPaths(currentProfile, this.url);
                profileBuilder.normalizeRemoteAssetDirectoryPaths(this, websocketConnection.url);
                this.sendMessage(currentProfile);


            }
        } catch (error) {
            errorMsg = error;
        }

        return new Promise(function (resolve, reject) {

            if (errorMsg) {
                console.log(errorMsg);
                reject(errorMsg);
            } else {
                resolve();
            }

        });


    }

    sendMessage(msg) {

        this.ws.send(JSON.stringify(msg));
    }

    connectionClosed() {

        let network = require("./network");
        network.removeWebSocketConnection(this);
        console.log("Closed");

    }

    createUserDirectory() {

    }
    logout(){
        let request = {
            type: "userLogout",
            result: null,
        };
        this.sendMessage(request);
    }

    updateProfile(profile,normalized){
        profile.uuid = this.profile.uuid;

        if(!normalized){
            let profileBuilder = require("../profile/profile-builder");
            profileBuilder.createClassMappings(profile);
            if (!profile.debugMode) {
                profileBuilder.normalizeCSSPaths(profile, this.url);
            }
            profileBuilder.normalizeIconPaths(profile, this.url);
            profileBuilder.normalizeRemoteAssetDirectoryPaths(profile, this.url);
        }

        this.profile = profile;

        console.log("Sending update message");
        let request = {
            type: "userUpdateResult",
            result: this.profile,
        };
        this.sendMessage(request);


    }


    async verify(token) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [CHROME_CLIENT_ID, FIREFOX_CLIENT_ID, IOS_CLIENT_ID] // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userId = payload['sub'];
        console.log("verify token- user id: " + userId);
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
        return {
            googleId: payload['sub'],
            email: payload['email']
        };
    }
}

module.exports = WebSocketConnection;