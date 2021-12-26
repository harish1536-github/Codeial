const passport=require('passport');
//importing a strategy
const JWTStrategy = require('passport-jwt').Strategy;
//Extracting jwt from header
const ExtractJWT=require('passport-jwt').ExtractJwt;

//going to use user model for  authentication 
//when we are going to establish the identity of user
// so we are using model user here
const User=require('../models/user');
// const env=require('./environment');

//I need to encrypt using key 
// a key is to be present to able to e ncrypt any text and decrypt back
let opts={
    // header has key called authorization and that authoriztion has a key called bearer and that bearer will have JWT Token
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    //encryption and decryption string every encryption go through this and decryption happens because of this
    secretOrKey : 'blahsomething'
}
//use JWTStrategy
passport.use(new JWTStrategy(opts,function(jwtpayload,done){
    // the callback function reads data from PayLoad as payload contain info of user
   
   
   
    User.findById(jwtpayload._id,function(err,User){
        if(err)
        {
            console.log("Error in finding User from JWT");
            return;
        }
        if(User)
        {
            return done(null,User);
        }else{
            return done(null,false);
        }
    })


}));
module.exports=passport;