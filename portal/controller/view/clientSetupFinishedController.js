/** Express router providing client related routes
 * @module clientSetupFinished
 * @requires express
 */

module.exports = {
    /**
     * Renders the finished setup view. 
     * @memberof module:clientSetupFinished
     * @param {Request} req Request object that includes the unique UserId
     * @param {Response} res Response object that is used for storing the content
     * @param next Not used
     */
    setupFinishedController: async (req, res, next) => {
        delete req.session.setupInformation;
        delete req.session.step;

        try {
            res.locals.userId = req.session.user.id;
        }catch (e) {
            console.log(e);
        }

        res.locals.lang = req.locale;

        res.render('client_setup_finished', res.locals.context);
    }
};