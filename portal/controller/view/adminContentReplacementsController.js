const contentReplacementRepo = require("../../repository/contentReplacmentRepo");
const core = rootRequire("core/core");
const databaseManager = core.databaseManager;
const mysql = require('mysql');

module.exports = {
    /**
     * Gets the content replacements for a given user from the repository
     * @memberof module:caretakerContentReplacement
     * @param {Request} req Request object that includes the unique UserId
     * @param {Response} res Response object that is used for storing the content
     * @param {object} next Returns the response object
     * @returns Returns the next object
     */
    allContentReplacements: async (req, res, next) => {

        let results = [];

        const allContentReplacements = await contentReplacementRepo.getAllContentReplacements();

        res.locals.context = {
            contentReplacements: allContentReplacements,
            backURL: req.session.returnTo || '/',
            ...res.locals.context
        };

        return next();
    },

    /**
     * Gets the content replacements for a given id from the repository
     * @memberof module:caretakerContentReplacement
     * @param {Request} req Request object that includes the content ID to get
     * @param {Response} res Response object that is used for storing the content
     * @param next Returns the response object
     * @returns Returns the next object
     */
    getContentReplacementsById: async (req, res, next) => {
        let id = null;
        if ('user' in req && 'id' in req.user) {
            id = req.user.id;
        }
        if (!id) return res.redirect('/');

        let contentReplacement = null;

        if (req.query.id) {
            contentReplacement = await contentReplacementRepo.getContentReplacementsById(req.query.id);
        }

        res.locals.context = {
            contentReplacement: contentReplacement,
            backURL: req.session.returnTo || '/',
            ...res.locals.context
        };

        return next();
    },

    /**
     * Add or Update the content replacements for a given user from the repository
     * @memberof module:caretakerContentReplacement
     * @param {Request} req Request object that includes the unique UserId and the content as body
     * @param {Response} res Response object that used for redirect to next page
     * @param next Not used
     * @returns {Response} Returns the res object
     */
    saveOrUpdateContentReplacement: async (req, res, next) => {
        if (!req.body || !req.user.id) {
            return res.sendStatus(401).end();
        }

        if (req.body.active === "true") {
            req.body.active = true;
        } else {
            req.body.active = false;
        }

        try {
            for (let prop in (req.body)) {
                if (Object.prototype.hasOwnProperty.call(req.body, prop)) {

                    req.body[prop] = mysql.escape(req.body[prop]);


                    if (req.body[prop].startsWith("'") && req.body[prop].endsWith("'")) {
                        req.body[prop] = req.body[prop].substr(1);
                        req.body[prop] = req.body[prop].substring(0, req.body[prop].length - 1);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }


        //UPDATE
        if (req.body.id) {
            let request = databaseManager.createRequest("content_replacement").update(req.body).where("id", "=", req.body.id);
            let updateRequest = await databaseManager.executeRequest(request);
        } else {
            req.body.pid = req.user.id;

            let request = databaseManager.createRequest("content_replacement").insert(req.body);
            let newContentReplacement = await databaseManager.executeRequest(request);
        }

        return res.redirect('/admin/content_replacements');
    },

    /**
     * What does this function do?
     * @memberof module:caretakerContentReplacement
     * @param {Request} req Request object that includes the unique UserId and the content as body
     * @param {Response} res Response object that is used for storing the content and set response status
     * @param next Not used
     * @returns {Response} Returns the res object
     */
    deleteContentReplacement: async function (req, res, next) {

        let id = 0;
        for (let element in req.body) {
            if (element.startsWith("delete_")) {
                id = element.replace("delete_", "");
            }
        }

        try {
            if (id) {
                let deleteContentReplacementRequest = databaseManager.createRequest("content_replacement")
                    .where("id", '=', id).delete();
                let result_remove = await databaseManager.executeRequest(deleteContentReplacementRequest);
            } else {
                return res.sendStatus(401).end();
            }
        } catch (error) {
            return res.sendStatus(500).end();
        }


        return res.redirect('/admin/content_replacements');

    }
};