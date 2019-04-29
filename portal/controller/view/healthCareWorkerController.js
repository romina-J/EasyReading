module.exports = {

    getProfileByRole: async (req, res, next) => {

        let profiles = [];
        try {

            const core = rootRequire("core/core");
            const databaseManager = core.databaseManager;

            const getProfileRequest = databaseManager.createRequest("profile").where("role", "=", rootRequire("core/profile/profile-role").HEALTH_CARE_WORKER);
            const getProfileRequestResult = await databaseManager.executeRequest(getProfileRequest);

            profiles = [...getProfileRequestResult.result];

        } catch (e) {

        }

        res.locals.context = {
            profiles: profiles,
            ...res.locals.context
        }

        //console.log(res.locals.context);

        return next();
    },
    getProfilebyId: async (req, res, next) => {

        let profile = {};
        try {

            const id = parseInt(req.params.id);
            if (id !== NaN) {

                const core = rootRequire("core/core");
                const databaseManager = core.databaseManager;

                const getProfileRequest = databaseManager.createRequest("profile").where("id", "=", id);
                const getProfileRequestResult = await databaseManager.executeRequest(getProfileRequest);

                if (getProfileRequestResult.result.length > 0)
                    profile = { ...getProfileRequestResult.result[0] };

                // TO DO load clients                
                //const getPatientProfileRequest = databaseManager.createRequest("profile").where("role", "=", rootRequire("core/profile/profile-role").PATIENT);
                //const getPatientProfileRequestResult = await databaseManager.executeRequest(getPatientProfileRequest);

                //if (getPatientProfileRequestResult.result.length > 0)
                //    profile["patients"] = [...getPatientProfileRequestResult.result];

                const sql = `SELECT p.*, 
                                CASE WHEN hcwp.health_care_worker_id IS NULL THEN 0 ELSE 1 END AS connected
                            FROM profile p
                            LEFT JOIN  (SELECT * FROM health_care_worker_patient WHERE health_care_worker_id = ?) hcwp ON p.id = hcwp.patient_id
                            WHERE p.role = ?;`
                const sqlParamters = [id, rootRequire("core/profile/profile-role").PATIENT];
                
                const getPatientProfileRequestResult = await databaseManager.executeSql(sql, sqlParamters);
                if (getPatientProfileRequestResult.result.length > 0)
                    profile["patients"] = [...getPatientProfileRequestResult.result];
                else 
                    profile["patients"] = [];

            }
        } catch (e) {

        }

        res.locals.context = {
            profile: profile,
            ...res.locals.context
        }

        //console.log(res.locals.context);

        return next();
    }
}