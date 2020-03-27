module.exports = {
    setupFinishedController: async (req, res, next) => {

        delete req.session.setupInformation;
        delete req.session.step;


        res.locals.lang = req.locale;

        res.render('client_setup_finished', res.locals.context);

    }

};
