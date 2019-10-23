// This application uses express as its web server
// for more info, see: http://expressjs.com
const express = require('express');
const path = require('path');
const hbs = require("./handlebars/hbs-setup");
const passport = require("./passport/passportSetup");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const localeService = require("./../core/i18n/locale-service");

// create a new express server
const app = express();

// Ensure express is looking at our views directory for templates
app.set('views', path.join(__dirname, '..', 'public', 'views'))

app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '..', 'public', 'views', 'partials'));


// app.set('view cache', true) // uncomment to cache already rendered views

// Ensure we automatically parse any json-bodies
app.use(express.json());

/*
var simulateLatency = require('express-simulate-latency');
// use as middleware for all subsequent handlers...
var smallLag = simulateLatency({ min: 500, max: 1000 });
app.use(smallLag);
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    secret: "set this secrect to a config file",
    proxy: true,
    resave: false,
    saveUninitialized: true,
    expires: new Date(Date.now() + (30 * 1000 * 60))
}));

app.use(localeService.i18nProvider.init);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    req.connection.setNoDelay(true);
    next();
});

// Serve the files out of ./public as our main files
app.use(express.static(baseDirPath('public')))

// Controllers
const patientController = require("./controller/view/patientController");
const authentication = require("./passport/authentication");
const clientLoginController = require("./controller/api/clientLoginController");
const clientFacebookLoginController = require("./controller/api/clientFacebookLoginController");
const clientAnonymLoginController = require("./controller/api/clientAnonymousLoginController");
const clientLogoutController = require("./controller/api/clientLogoutController");
const clientWelcomeController = require("./controller/view/clientWelcomeViewController");
const caretakerWelcomeController = require("./controller/view/caretakerWelcomeViewController");
const localeController = require("./controller/view/localeController");
const userController = require("./controller/view/userController");
const customFunctionController = require("./controller/api/customFunctionController");
const customFunctionViewController = require("./controller/view/customFunctionView");
const clientCaretakerOverviewController = require("./controller/view/clientCaretakerOverviewController");
const clientCaretakerRegisterController = require("./controller/view/clientCaretakerRegisterController");
const caretakerClientOverviewController = require("./controller/view/caretakerClientOverviewController");
const caretakerDomHelperController = require("./controller/view/caretakerDomHelperController");

// Authentication routes
//Caretaker
app.get('/login', userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateBackEnd, localeController.translateClientWelcome, (_, res) => res.render('caretaker_login', res.locals.context));
app.get('/caretaker/login/google', passport.authenticate("google"));
app.get('/caretaker/login/facebook', passport.authenticate("facebook"));
app.get('/auth/callback', passport.authenticate("google"), authentication.redirectToOrigin);

//Client
app.use('/client/login/anonym',clientAnonymLoginController ,authentication.redirectToOrigin);
app.use('/client/login', clientLoginController);
app.use('/client/login/facebook', clientFacebookLoginController);
app.get('/client/login/facebook/auth', passport.authenticate('facebook'), authentication.redirectToOrigin);

//Logout
app.get('/client/logout', clientLogoutController);



// Index
app.get('/', userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateBackEnd, localeController.translateClientWelcome, caretakerWelcomeController, (_, res) => res.render('caretaker_welcome', res.locals.context));
app.post('/', userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateBackEnd, localeController.translateClientWelcome, caretakerWelcomeController, (_, res) => res.render('caretaker_welcome', res.locals.context));

// Function Editor
app.use('/client/function-editor', customFunctionController, (_, res) => res.render('function_editor', res.locals));
app.use('/client/function-overview', customFunctionViewController, (_, res) => res.render('function_view', res.locals));


// Caretaker
app.get('/caretaker/clients', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateClientList, caretakerClientOverviewController, (_, res) => res.render('caretaker_clients', res.locals.context));
app.get('/caretaker/client-configure', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateConfigure, patientController.getEngineConfigByuserId, (_, res) => res.render('caretaker_client_configure', res.locals.context));
app.get('/caretaker/custom-paragraphs-overview', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateDomHelpers, caretakerDomHelperController.getDOMHelpersByuserId, (_, res) => res.render('caretaker_domhelpers', res.locals.context));
app.get('/caretaker/custom-paragraph', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateDomHelpers, caretakerDomHelperController.getDOMHelperById, (_, res) => res.render('caretaker_domhelper_edit', res.locals.context));
app.post('/caretaker/custom-paragraph', caretakerDomHelperController.editDomHelper);
app.post('/caretaker/add-custom-paragraph', caretakerDomHelperController.saveDomHelper);
app.post('/caretaker/custom-paragraphs-action', caretakerDomHelperController.quickEditDomHelper);

// Client
app.use('/client/welcome', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateClientWelcome, clientWelcomeController, (_, res) => res.render('client_welcome', res.locals.context));
app.get('/client/configure', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateConfigure, patientController.getEngineConfigByuserId, (_, res) => res.render('client_configure', res.locals.context));
//Client Caretaker Management
app.use('/client/caretakers', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateCaretakerList, clientCaretakerOverviewController, (_, res) => res.render('client_caretaker_overview', res.locals.context));
app.use('/client/caretaker/register', authentication.isAuthenticated, userController.setUser, localeController.setLocale, localeController.translateMain, localeController.translateConfigure, localeController.translateClientCaretakerRegister, clientCaretakerRegisterController, (_, res) => res.render('client_caretaker_register', res.locals.context));

// API routes
const egineController = require("./controller/api/engineController");
const profileController = require("./controller/api/profileController");
app.post('/api/v1/configuration', egineController.updateEngineConfiguratoin);
/*
app.post('/api/v1/profile', profileController.createProfile);
app.patch('/api/v1/profile', profileController.updateProfile);
app.post('/api/v1/setType', profileController.setType);
*/
app.post('/api/v1/updateUserInterface', profileController.updateUserInterface);

module.exports = app;