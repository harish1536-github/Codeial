
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env=require('../../../config/environment');

module.exports.createSession = async function(req, res){

    try{
        let user = await User.findOne({email: req.body.email});
        //If user is found
        if (!user || user.password != req.body.password){
            //422 is error code
            return res.json(422, {
                message: "Invalid username or password"
            });
        }
        //if user found return response with status code 200
        return res.json(200, {
            message: 'Sign in successful, here is your token, please keep it safe!',
           //.sing is function to which i pass user  key codeial as same key to encrypt so we use same here to decrypt and expiry date
            data:  {
                //passing the token using jwt library
                token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn:  '100000'})
            }
        })

    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}