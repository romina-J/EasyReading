/** Passport authentication
 * @module passport/authentication
 */

module.exports = {
    /**
     * Recirect after authentication if user is authenticated
     * @memberof module:passport/authentication
     * @param {Request} req Request object that holds the return url and the authenticated status
     * @param {Response} res Response object that is used for redirection
     * @param {object} next Next object that just is returned
     */
    isAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }

        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    },
    /**
     * Recirect to origin
     * @memberof module:passport/authentication
     * @param {Request} req Request object that holds the user
     * @param {Response} res Response object that is used for redirection
     * @param {object} next Not used
     */
    redirectToOrigin: (req, res, next) => {
        if (req.session._clientToken) {
            //console.log(req.session._clientToken);
        }

        req.session.user = {...req.user};
        let returnURL = req.session.returnTo || '/';
        delete req.session.returnTo;

        res.redirect(returnURL);

    },
    caretakerAPIAuth: (req, res, next) => {
        if (req.isAuthenticated()) {

            if (req.user) {

                if (req.user.roles) {

                    if (Array.isArray(req.user.roles)) {
                        if (req.user.roles.includes("caretaker")) {
                            return next();
                        }
                    }


                }

            }
        }

        return res.json(JSON.stringify({
            value: true,
            type: "login"
        }));


    }


};