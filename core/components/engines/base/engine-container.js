class EngineContainer{
    constructor(id){
        this.engine = id;
        this.versions = [];
    }


    addVersion(versionID, engine){
        engine.version = versionID;
        this.versions.push({
            version : versionID,
            engine : engine
        });


    }

    versionCount(){
        return this.versions.length;
    }

    getLatestVersion(){
        return this.versions[this.versions.length-1].engine;
    }



}

module.exports.EngineContainer = EngineContainer;