const core = rootRequire("core/core");
const databaseManager = core.databaseManager;

module.exports = {

    getDomHelpersByUserId : async (id, active=null) => {

        let sql = "SELECT dh_conf.* FROM profile p " +
                "INNER JOIN dom_help_collection dh_coll ON p.id = dh_coll.pid " +
                "INNER JOIN dom_help_configuration dh_conf ON dh_coll.id = dh_conf.dom_help_collection " +
                "WHERE p.id=?";

        let sqlParamters = [id];
        if (active !== null) {
            sql += " AND dh_coll.active=?";
            let active_int = 0;
            if (active) {
                active_int = 1;
            }
            sqlParamters.push(active_int);
        }
        return await databaseManager.executeSql(sql, sqlParamters);
    },

    getDomHelpersById : async (dh_id, col_active=null) => {
        let sql = '';
        let sqlParams = [dh_id];
        if (col_active == null) {
            sql = "SELECT dh_conf.* from dom_help_configuration dh_conf WHERE dh_conf.id=?"
        } else {
            let active_int = 0;
            if (col_active) {
                active_int = 1;
            }
            sql = "SELECT dh_conf.* from dom_help_collection dh_coll " +
                "INNER JOIN dom_help_configuration dh_conf ON dh_coll.id = dh_conf.dom_help_collection " +
                "WHERE dh_conf.id=? AND dh_coll.active=?";
            sqlParams.push(active_int);
        }
        return await databaseManager.executeSql(sql, sqlParams);
    }
};
