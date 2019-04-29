module.exports = {

    getProfileByRole: async (req, res, next) => {


        try {
            if (isNaN(req.params.role))
                return res.send("no a number");

            const core = rootRequire("core/core");
            const databaseManager = core.databaseManager;

            const getProfileRequest = databaseManager.createRequest("profile").where("role", "=", req.params.role);
            const getProfileRequestResult = await databaseManager.executeRequest(getProfileRequest);
            //req.params.role

            return res.send("get" + JSON.stringify(getProfileRequestResult));
        } catch (e) {
            return res.send("Failed to get profiles" + JSON.stringify(e));
        }
    },
    createProfile: async (req, res, next) => {

        
        const profileData = {
            email: req.body.profile.email,
            role: rootRequire("core/profile/profile-role").HEALTH_CARE_WORKER
        };

        try {

            const core = rootRequire("core/core");
            const databaseManager = core.databaseManager;

            const saveProfileRequest = databaseManager.createRequest("profile").insert(profileData);
            const saveProfileRequestResult = await databaseManager.executeRequest(saveProfileRequest);
                        
            return res.status(200).json({action: "added"});
        } catch (e) {            
            return res.status(500).json(e);
        }
    },
    updateProfile: async (req, res, next) => {

        try {
            const profile = req.body.profile;
            //console.log(JSON.stringify(profile));

            const core = rootRequire("core/core");
            const databaseManager = core.databaseManager;

            const deleteRequest = databaseManager.createRequest("health_care_worker_patient").where("health_care_worker_id", "=", profile.id).delete();
            const deleteRequestResult = await databaseManager.executeRequest(deleteRequest);

            for (const patient of profile.patients) {
                if (patient.connected === 1) {

                    const sql = `INSERT INTO health_care_worker_patient
                        (health_care_worker_id, patient_id)
                        VALUES (?, ?);`;
                    const sqlParamters = [profile.id, patient.id];

                    const insertResult = await databaseManager.executeSql(sql, sqlParamters);
                }
            }

            return res.status(200).json({action: "updated"});
        } catch (e) {
            console.log(e);
            return res.status(500).json(e);
        }
    }
}