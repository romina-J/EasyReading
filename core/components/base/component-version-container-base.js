class ComponentVersionContainer{
    constructor(id){
        this.id = id;
        this.versions = [];
    }


    addVersion(versionID, version){
        version.versionID = versionID;
        this.versions.push({
            id : versionID,
            version : version,
        });


    }

    versionCount(){
        return this.versions.length;
    }

    getLatestVersion(){
        return this.versions[this.versions.length-1].version;
    }



}

module.exports = ComponentVersionContainer;