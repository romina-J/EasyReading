const domHelperRepo = require("../../repository/domHelperRepo");
const core = rootRequire("core/core");
const databaseManager = core.databaseManager;

module.exports = {
    getDOMHelpersByuserId: async (req, res, next) => {

        const id = req.query.id;
        if (!id) return res.redirect('/');

        let results = [];

        const domHelpersForUser = await domHelperRepo.getDomHelpersByUserId(id);

        if ('result' in domHelpersForUser) {
            results = domHelpersForUser['result'];
        }

        res.locals.context = {
            domHelpers: results,
            backURL: req.session.returnTo || '/',
            ...res.locals.context
        };

        return next();
    },

    getDOMHelperById: async (req, res, next) => {

        let id = null;
        if ('user' in req && 'id' in req.user) {
            id = req.user.id;
        }
        if (!id) return res.redirect('/');

        let domHelper = null;
        let results = [];
        if(req.query.id){
            results = await domHelperRepo.getDomHelpersById(req.query.id);
            if ('result' in results) {
                domHelper = results['result'].pop();
            }
        }

        res.locals.context = {
            domHelper: domHelper,
            backURL: req.session.returnTo || '/',
            ...res.locals.context
        };

        return next();
    },

    /**
     * Save a new DOM Helper from a POST request
     */
    saveDomHelper: async (req, res, next) => {
        if (!req.body || !req.user.id) {
            return res.sendStatus(401).end();
        }

        let id = 0;

        let dom_helper = {};
        dom_helper['active'] = 1;
        Object.assign(dom_helper, req.body);

        try {
            let profileBuilder = rootRequire("core/profile/profile-builder");
            id = req.user.id;

            const loadProfileRequest = databaseManager.createRequest("profile").where("id", "=", id);
            const loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);

            if (loadProfileRequestResult.result.length > 0) {

                let userDomHelpers = await profileBuilder.loadActiveDomHelpers(loadProfileRequestResult.result[0]);
                let dom_collection = 0;
                if (userDomHelpers.length <= 0) {
                    let dom_coll_row = {
                        'pid': loadProfileRequestResult.result[0].id,
                        'active': 1,
                    };
                    let insertDomCollRequest = databaseManager.createRequest("dom_help_collection")
                        .insert(dom_coll_row);
                    let result = await databaseManager.executeRequest(insertDomCollRequest);
                    if (result.result && result.result.affectedRows === 1 && result.result.insertId)  {
                        dom_collection = result.result.insertId;
                    }
                } else {
                    // Only one active DOM collection per user allowed
                    dom_collection = userDomHelpers[0].dom_help_collection;
                }
                if (dom_collection > 0) {
                    dom_helper['dom_help_collection'] = dom_collection;
                    let insertDomHelperRequest = databaseManager.createRequest("dom_help_configuration")
                        .insert(dom_helper);
                    let result = await databaseManager.executeRequest(insertDomHelperRequest);
                } else {
                    return res.sendStatus(500).end();
                }
            } else {
                return res.sendStatus(401).end();
            }
        } catch (error) {
            return res.sendStatus(500).end();
        }

        return res.redirect('/caretaker/custom-paragraphs-overview?id=' + id);

    },

    editDomHelper: async (req, res, next) => {

        if (!req.body || !req.user.id) {
            return res.sendStatus(401).end();
        }

        let id = 0;
        let coreTableDefinitions = rootRequire("core/database/core-table-definitions").getDefinitions();
        let form_names = [];
        for (let i=0; i<coreTableDefinitions.length; i++) {
            if ('title' in coreTableDefinitions[i] && coreTableDefinitions[i].title === "dom_help_configuration") {
                form_names.push(...Object.keys(coreTableDefinitions[i].properties));
                break;
            }
        }

        let savedDomHelpers = {};
        for (let name in req.body) {
            for (let i=0; i<form_names.length; i++) {
                if (name.startsWith(form_names[i])) {
                    let prop_name = form_names[i];
                    let str_split = name.split('-');
                    let index = str_split[str_split.length - 1];
                    if (index in savedDomHelpers) {
                        savedDomHelpers[index][prop_name] = req.body[name];
                    } else {
                        savedDomHelpers[index] = {};
                        savedDomHelpers[index][prop_name] = req.body[name];
                    }
                }
            }
        }

        let profileBuilder = rootRequire("core/profile/profile-builder");

        try {
            id = req.user.id;

            const loadProfileRequest = databaseManager.createRequest("profile").where("id", "=", id);
            const loadProfileRequestResult = await databaseManager.executeRequest(loadProfileRequest);

            if (savedDomHelpers && loadProfileRequestResult.result.length > 0) {
                for (let obj_id in savedDomHelpers) {
                    if (savedDomHelpers.hasOwnProperty(obj_id)) {
                        if (await userOwnsDOMHelper(id, obj_id)) {
                            let newDomHelper = savedDomHelpers[obj_id];
                            let updateDomHelperRequest = databaseManager.createRequest("dom_help_configuration")
                                .where("id", '=', obj_id).update(newDomHelper);
                            let result_remove = await databaseManager.executeRequest(updateDomHelperRequest);
                        } else {
                            return res.sendStatus(401).end();
                        }
                    }
                }
            } else {
                return res.sendStatus(401).end();
            }
        } catch (error) {
            return res.sendStatus(500).end();
        }

        return res.redirect('/caretaker/custom-paragraphs-overview?gid=' + id);
    },

    quickEditDomHelper: async (req, res, next) => {
        let id = 0;
        if (!req.body || !req.user.id) {
            return res.sendStatus(401).end();
        }
        try {
            for (let element in req.body) {
                if (element.startsWith("delete_")) {
                    res.locals.context = {
                        domHelperID: element.replace("delete_", ""),
                        backURL: req.session.returnTo || '/',
                        ...res.locals.context
                    };
                    return deleteDomHelper(req, res, next);
                }
            }
        } catch (error) {
            return res.sendStatus(500).end();
        }
    }
};



const deleteDomHelper = async (req, res, next) => {

    let id = 0;
    if (!req.body || !req.user.id) {
        return res.sendStatus(401).end();
    }

    try {
        id = req.user.id;
        if (res.locals.context.domHelperID && await userOwnsDOMHelper(id, res.locals.context.domHelperID)){
            let deleteDomHelperRequest = databaseManager.createRequest("dom_help_configuration")
                .where("id", '=', res.locals.context.domHelperID).delete();
            let result_remove = await databaseManager.executeRequest(deleteDomHelperRequest);
        } else {
            return res.sendStatus(401).end();
        }
    } catch (error) {
        return res.sendStatus(500).end();
    }

    return res.redirect('/caretaker/custom-paragraphs-overview?id=' + id);

};


const userOwnsDOMHelper = async (u_id, dh_id) => {
    let allowed = false;
    if (u_id && dh_id > 0) {
        let results = [];
        const domHelpersForUser = await domHelperRepo.getDomHelpersByUserId(u_id);
        if ('result' in domHelpersForUser) {
            results = domHelpersForUser['result'];
        }
        for (let i=0; i<results.length; i++) {
            if ('id' in results[i] && results[i].id == dh_id) {
                allowed = true;
                break;
            }
        }
    }
    return allowed;
};
