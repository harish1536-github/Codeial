const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


// authentication using passport
//telling passport to use localStrategy 
passport.use(new LocalStrategy({

    //providing syntax for username field
        usernameField: 'email',
        passReqToCallback:true
    },
    //function uses email password and done
    //done is callback function 
    //finding usser by email
    //Due to passReqToCallback we get req parameter in function
    //as first argument
    function(req,email, password, done){
        // find a user and establish the identity
        //first email property second emwil is value which we 
        // passed on 
        User.findOne({email: email}, function(err, user)  {
            // if error occured then 
            if (err){
                //type error
                req.flash('error',err);
                // console.log('Error in finding user --> Passport');
                return done(err);
            }
            // if user there is no user and password not equal to password entered 
            if (!user || user.password != password){
                req.flash('error','Invalid Username/Password');
                // console.log('Invalid Username/Password');
                //done takes two arguments first one is error
                //here there is no error so null
                //second one describes that authentication is not done 


                //false describe that authentication is not being done
                return done(null, false);
            }
 //done is callback functiion which is returing to passport.js
            return done(null, user);
        });
    }


));


// serializing the user to decide which key is to be kept in the cookies

//serialize user function 
//taking out id and putting into the cookie this is basically telliing
//that we need to put user id into the cookie and not the rest of info 

//serializeUser is inbuilt funtion
passport.serializeUser(function(user, done){
    //callback function to set id into cookie
    done(null, user.id);
});



// deserializing the user from the key in the cookies

//deserialize user function
//cookie send back to server and we are establishing the idenetity the 
//identiy of which user is there from database we 
//are using that id to find the user

//desrializeUser is also inbuilt function
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        // null as no error and user as user is found
        return done(null, user);
    });
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        //return to next function which is to be called inline 
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}
//acess the authenticated user in views so we check if request is authenticated
passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie 
        // and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
//
    next();
}



module.exports = passport;