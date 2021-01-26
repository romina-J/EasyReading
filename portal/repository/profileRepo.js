/** Profile repository
 * @module profileRepo
*/

const core = rootRequire("core/core");
const databaseManager = core.databaseManager;

module.exports = {
    /**
    * Get user profile by email
    * @memberof profileRepo
    * @param {string} email Email to get profile for
    * @returns {object} returns the user profile  
    */    
    getProfileByEmail: async (email) => {
        let loadProfileRequest = databaseManager.createRequest("profile").where("email", "=", email);

        let loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);

        if (loadProfileRequestResult.result.length > 0) {

            let profile = loadProfileRequestResult.result[0];

            let loadProfileRoleRequest = databaseManager.createRequest("role").where("user_id", "=", profile.id);

            let loadProfileRoleRequestResult = await databaseManager.executeRequest(loadProfileRoleRequest);

            profile.roles = [];

            for (let i = 0; i < loadProfileRoleRequestResult.result.length; i++) {
                profile.roles.push(loadProfileRoleRequestResult.result[i].role);
            }

            return profile;
        }
    },

    /**
    * Get user profile by id
    * @memberof profileRepo
    * @param {number} id Id to get profile for
    * @returns {object} returns the user profile  
    */      
    getProfileId: async (id) => {
        let loadProfileRequest = databaseManager.createRequest("profile").where("id", "=", id);

        let loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);

        if (loadProfileRequestResult.result.length > 0) {

            let profile = loadProfileRequestResult.result[0];

            let loadProfileRoleRequest = databaseManager.createRequest("role").where("user_id", "=", profile.id);

            let loadProfileRoleRequestResult = await databaseManager.executeRequest(loadProfileRoleRequest);

            profile.roles = [];

            for (let i = 0; i < loadProfileRoleRequestResult.result.length; i++) {
                profile.roles.push(loadProfileRoleRequestResult.result[i].role);
            }

            return profile;
        }
    },

    /**
    * Get profile language for user id
    * @memberof profileRepo
    * @param {number} id User id
    * @returns {object} returns the user profile language  
    */      
    getProfileLanguage: async (id) => {
        const sql = `SELECT locale FROM profile
                     WHERE id = ?
                     `;

        const sqlParameters = [id];

        const profileResult = await databaseManager.executeSql(sql, sqlParameters);

        if (profileResult.result.length) {
            return profileResult.result[0]['locale'];
        } else {
            return "en";
        }
    },
};