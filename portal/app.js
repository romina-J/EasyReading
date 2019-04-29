// This application uses express as its web server
// for more info, see: http://expressjs.com
const express = require('express')
const path = require('path')
const hbs = require("./handlebars/hbs-setup");
const passport = require("./passport/passportSetup");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// create a new express server
const app = express()

// Ensure express is looking at our views directory for templates
app.set('views', path.join(__dirname, '..', 'public', 'views'))

app.set('view engine', 'hbs')
// app.set('view cache', true) // uncomment to cache already rendered views

// Ensure we automatically parse any json-bodies
app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
   secret: "set this secrect to a config file",
   proxy: true,
   resave: false,
   saveUninitialized: true,
   expires: new Date(Date.now() + (30 * 1000 * 60))
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    req.connection.setNoDelay(true);
    next();
});
// Serve the files out of ./public as our main files
app.use(express.static(baseDirPath('public')))

// View routes
const patientController = require("./controller/view/patientController");
const healthcareworkerController = require("./controller/view/healthCareWorkerController");
const authentication = require("./passport/authentication");
const clientLoginController = require("./controller/api/clientLoginController");
const clientLogoutController = require("./controller/api/clientLogoutController");
const clientWelcomeController = require("./controller/view/clientWelcomeViewController");

// patient config routes
app.get('/', (_, res) => res.render('index', res.locals.context))
app.get('/profiles', authentication.isAuthenticated, patientController.getPatientsByHealthCareWorker, (_, res) => res.render('profiles', res.locals.context));
app.get('/profile', authentication.isAuthenticated, patientController.getOwnProfile, (_, res) => res.render('profile', res.locals.context));
app.get('/configure', authentication.isAuthenticated, patientController.getEngineConfigByuserId, (_, res) => res.render('configure', res.locals.context));

// health care worker routers
app.get('/registerprofile', (_, res) => res.render('register_profile', res.locals.context))
app.get('/healthcareworker/:id', healthcareworkerController.getProfilebyId, (_, res) => res.render('health_care_woorker_configure', res.locals.context))
app.get('/healthcareworker', healthcareworkerController.getProfileByRole, (_, res) => res.render('health_care_woorker_list', res.locals.context))

// authentication routes
// portal login
app.get('/login', passport.authenticate("google"));
// client login(browser extension, mobile app)
app.use('/client/login', clientLoginController);
app.use('/client/welcome',authentication.isAuthenticated, clientWelcomeController, (_, res) => res.render('client_welcome', res.locals));
app.get('/client/configure', authentication.isAuthenticated, patientController.getEngineConfigByuserId, (_, res) => res.render('configure', res.locals.context));
app.get('/client/logout', clientLogoutController);


app.get('/auth/callback', passport.authenticate("google"), authentication.redirectToOrigin);


// API routes
const egineController = require("./controller/api/engineController");
const profileController = require("./controller/api/profileController");
app.post('/api/v1/configuration', egineController.updateEngineConfiguratoin)
//app.get('/api/v1/profile/role/:role', profileController.getProfileByRole);
app.post('/api/v1/profile', profileController.createProfile);
app.patch('/api/v1/profile', profileController.updateProfile);

module.exports = app