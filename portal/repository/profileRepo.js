const core = rootRequire("core/core");
const databaseManager = core.databaseManager;

module.exports = {

    getHealthCareWorkerByEmail: async (email) => {

        const sql = `SELECT * FROM profile
                     WHERE email = ?
                       and role = ?;`;

        const sqlParamters = [email, rootRequire("core/profile/profile-role").HEALTH_CARE_WORKER];

        const profileResult = await databaseManager.executeSql(sql, sqlParamters);

        return profileResult;
    },
    getOwnProfileByEmail: async (email) => {

        const sql = `SELECT * FROM profile
                     WHERE email = ?
                       and role = ?;`;

        const sqlParamters = [email, rootRequire("core/profile/profile-role").PATIENT];

        const profileResult = await databaseManager.executeSql(sql, sqlParamters);

        return profileResult;
    },    
    getPatientByHealthCareWorkerId: async (id) => {

        const sql = `SELECT patient.* FROM profile patient
                     INNER JOIN (SELECT hcwp.patient_id
                        FROM profile p
                        INNER JOIN health_care_worker_patient hcwp ON p.id = hcwp.health_care_worker_id
                        WHERE p.id = ?) to_get ON patient.id = to_get.patient_id;`;

        const sqlParamters = [id];

        const profileResult = await databaseManager.executeSql(sql, sqlParamters);

        return profileResult;
    },    
    getOwnProfileId: async (id) => {

        const sql = `SELECT patient.* FROM profile patient WHERE role=0 AND id = ?`;

        const sqlParamters = [id];

        const profileResult = await databaseManager.executeSql(sql, sqlParamters);

        return profileResult;
    }
}