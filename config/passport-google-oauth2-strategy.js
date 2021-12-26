const passport = require("passport");
//defining the strategy
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
//importing crypto
const crypto = require("crypto");
const User = require("../models/user");
const env = require("./environment");

// tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      // clientID: '581066183110-4rvgm20fco0ne4btq1h3is1r4r12ih2v.apps.googleusercontent.com', // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com
      // clientSecret: 'YhZ7SJiJQyscQIzsJnBgYCz4', // e.g. _ASDFA%KFJWIASDFASD#FAD-
      // callbackURL: "http://localhost:8000/users/auth/google/callback",
      clientID:
        "166554182941-4cnucl94pnlt4d6h7hggjhjqricga94b.apps.googleusercontent.com",
      clientSecret: "dX-H-rl2iGmBmLPcARiFooGu",
      //  env.google_client_secret,
      callbackURL: "http://localhost:8000/users/auth/google/callback",
      // env.google_call_back_url,
    },
    //putting a callback function takes a accessToken
    //refresh token is also passed in case pur access token expires then refresh token genrates a new Token
    //done is final function which will take callback from this
    function (accessToken, refreshToken, profile, done) {
      // find a user
      //we will match user with email
      //user can have multiple email so we will match with the first email of user
      //using profile.email[0].valu profile.email will return array
      //.exec will take a function having error and user
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("error in google strategy-passport", err);
          return;
        }

        console.log(accessToken, refreshToken);
        //printing thr profile
        console.log(profile);

        if (user) {
          // if found, set this user as req.user
          //if user found then call done with no error and user
          return done(null, user);
        }
        //if user is not there then create the user and return done
        else {
          // if not found, create the user and set it as req.user
          User.create(
            {
              //setting the name and email
              name: profile.displayName,
              //setting the email to first email of user
              email: profile.emails[0].value,
              //crypto will be used here length =20 and in hexadecimal format
              password: crypto.randomBytes(20).toString("hex"),
            },
            function (err, user) {
              if (err) {
                console.log(
                  "error in creating user google strategy-passport",
                  err
                );
                return;
              }

              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
