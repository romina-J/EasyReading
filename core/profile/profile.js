class Profile {
    constructor(uuid) {

        this.id = 0;
        this.googleID = "";
        this.email = "";
        this.userLoaded = false;
        this.userInterfaces = [];
        this.plugins = [];  // Array of {id: string, version: string} e.g. [{id: 'test_plugin', version: '1.0'}]
        this.userInterfaceCollectionID = 0;
        this.uuid = uuid;
        this.role = require("./profile-role").PATIENT;

        let core = require("./../core");
        this.debugMode = core.debugMode;
        this.static = core.static;
    }

    async login(googleID, websocketConnection) {
        let errorMsg = null;
        try{

            this.googleID = googleID;

            let databaseManager = require("./../database/database-manager");

            let loadProfileRequest = databaseManager.createRequest("profile").where("googleID", "=", googleID);

            let loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);

            let profileBuilder = require("./profile-builder");
            if(loadProfileRequestResult.result.length > 0){
                this.id = loadProfileRequestResult.result[0].id;
                this.role = loadProfileRequestResult.result[0].role;
                await profileBuilder.loadActiveUserInterfaces(this);
            }else{

                profileBuilder.loadDefaultProfile(this);

                await profileBuilder.saveProfile(this);

            }

            profileBuilder.createClassMappings(this);


            if(!this.debugMode){
                profileBuilder.normalizeCSSPaths(this,websocketConnection.url);
            }
            profileBuilder.normalizeIconPaths(this,websocketConnection.url);
            profileBuilder.normalizeRemoteAssetDirectoryPaths(this,websocketConnection.url);

            this.userLoaded = true;
        }catch (error){
            errorMsg = error;
        }

        return new Promise(function (resolve,reject) {
            if(errorMsg){
                reject(errorMsg);
            }else{
                resolve();
            }
        });

    }

    async save(){
        let errorMsg = null;

        try{
            let profileBuilder = require("./profile-builder");
            await profileBuilder.saveProfile(this);

        }catch (error){
            errorMsg = error;
        }

        return new Promise(function (resolve,reject) {
            if(errorMsg){
                reject(errorMsg);
            }else{
                resolve();
            }
        });
    }

    async delete(){
        let errorMsg = null;

        try{
            let profileBuilder = require("./profile-builder");
            await profileBuilder.deleteProfile(this);

        }catch (error){
            errorMsg = error;
        }

        return new Promise(function (resolve,reject) {
            if(errorMsg){
                reject(errorMsg);
            }else{
                resolve();
            }
        });


    }



    getConfigurationForFunction(req) {

        if (typeof this.userInterfaces[req.ui.uiId].tools[req.ui.toolId].function.configuration !== 'undefined') {

            return this.userInterfaces[req.ui.uiId].tools[req.ui.toolId].function.configuration;
        }

    }

}

module.exports = Profile;