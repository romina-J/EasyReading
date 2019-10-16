const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const AnonymIdStrategy = require('passport-anonym-uuid').Strategy;
const profleRepo = require("../repository/profileRepo");
const config = require("../config/config");
let passportLogin = require("./passportLogin");
passport.use(new AnonymIdStrategy(async (req, uuid, done) => {

    let loginInfo = await passportLogin.createLoginInfoAnonym(req, uuid);
    await passportLogin.userLogin(req, loginInfo, function (newProfile, error) {
        return done(null, newProfile);
    });
}));
passport.use(
    new googleStrategy({
        callbackURL: config.google.callbackURL,
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        scope: config.google.scope,
        passReqToCallback: true,
    }, async (req, accessToken, refreshToken, profile, done) => {

        try {

            let loginInfo = await passportLogin.createLoginInfoGoogle(req, profile);
            await passportLogin.userLogin(req, loginInfo, function (newProfile, error) {
                return done(null, newProfile);
            });


        } catch (err) {

            console.log("error");

        }

    })
);


let FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: "681162132383572",
        clientSecret: "49b3620d5967fe76f9a04c835f4a5591",
        callbackURL: "/client/login/facebook/auth",
        profileFields: ['email'],
        passReqToCallback: true,
        auth_type: "reauthenticate"
    },
    async function (req, accessToken, refreshToken, profile, done) {

        try {

            let loginInfo = await passportLogin.createLoginInfoFacebook(req, profile);
            await passportLogin.userLogin(req, loginInfo, function (newProfile, error) {

                return done(null, newProfile);
            });


        } catch (err) {

            console.log("error");

        }

    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;

