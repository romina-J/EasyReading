/** Content replacment repository
 * @module contentReplacmentRepo
*/

const core = rootRequire("core/core");
const databaseManager = core.databaseManager;

module.exports = {

    getAllContentReplacements : async () => {
        let loadActiveContentReplacementRequest = databaseManager.createRequest("content_replacement");
        let loadActiveContentReplacementResult = await databaseManager.executeRequest(loadActiveContentReplacementRequest);

        return loadActiveContentReplacementResult.result;
    },

    /**
    * Get content replacements by user id
    * @memberof contentReplacmentRepo
    * @param {number} id Content replacement user id
    * @returns {object} Content replacement result
    */    
    getContentReplacementsByUserId : async (id) => {
        let loadActiveContentReplacementRequest = databaseManager.createRequest("content_replacement").where("pid", "=", id);
        let loadActiveContentReplacementResult = await databaseManager.executeRequest(loadActiveContentReplacementRequest);

        return loadActiveContentReplacementResult.result;
    },

    /**
    * Get content replacements by id
    * @memberof contentReplacmentRepo
    * @param {number} id Content replacement id
    * @returns {object} Content replacement result
    */        
    getContentReplacementsById : async (id) => {
        let loadActiveContentReplacementRequest = databaseManager.createRequest("content_replacement").where("id", "=", id);
        let loadActiveContentReplacementResult = await databaseManager.executeRequest(loadActiveContentReplacementRequest);
        if(loadActiveContentReplacementResult.result.length > 0){
            return loadActiveContentReplacementResult.result[0];
        }
    }
};